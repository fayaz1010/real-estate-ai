import prisma from "../../config/database";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface PropertyFilter extends DateRange {
  propertyId?: string;
  userId: string;
}

export class AccountingService {
  private async getUserPropertyIds(userId: string): Promise<string[]> {
    const properties = await prisma.property.findMany({
      where: { ownerId: userId, deletedAt: null },
      select: { id: true },
    });
    return properties.map((p) => p.id);
  }

  async getDashboardSummary(userId: string) {
    const propertyIds = await this.getUserPropertyIds(userId);

    if (propertyIds.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        occupancyRate: 0,
        totalProperties: 0,
        activeLeases: 0,
        pendingPayments: 0,
        overduePayments: 0,
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      incomeAgg,
      expenseAgg,
      totalProperties,
      activeLeases,
      pendingPayments,
      overduePayments,
      rentedProperties,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          propertyId: { in: propertyIds },
          type: "INCOME",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          propertyId: { in: propertyIds },
          type: "EXPENSE",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.property.count({
        where: { ownerId: userId, deletedAt: null },
      }),
      prisma.lease.count({
        where: {
          landlordId: userId,
          status: "ACTIVE",
        },
      }),
      prisma.payment.count({
        where: {
          lease: { landlordId: userId },
          status: "PAYMENT_PENDING",
        },
      }),
      prisma.payment.count({
        where: {
          lease: { landlordId: userId },
          status: "OVERDUE",
        },
      }),
      prisma.property.count({
        where: {
          ownerId: userId,
          status: "RENTED",
          deletedAt: null,
        },
      }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
    const occupancyRate =
      totalProperties > 0
        ? Math.round((rentedProperties / totalProperties) * 100)
        : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      occupancyRate,
      totalProperties,
      activeLeases,
      pendingPayments,
      overduePayments,
    };
  }

  async getIncomeStatement(filter: PropertyFilter) {
    const propertyIds = filter.propertyId
      ? [filter.propertyId]
      : await this.getUserPropertyIds(filter.userId);

    if (propertyIds.length === 0) {
      return { income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netIncome: 0 };
    }

    const [incomeRows, expenseRows] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["category"],
        where: {
          propertyId: { in: propertyIds },
          type: "INCOME",
          date: { gte: filter.startDate, lte: filter.endDate },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: {
          propertyId: { in: propertyIds },
          type: "EXPENSE",
          date: { gte: filter.startDate, lte: filter.endDate },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const income = incomeRows.map((r) => ({
      category: r.category,
      amount: Number(r._sum.amount ?? 0),
      count: r._count,
    }));
    const expenses = expenseRows.map((r) => ({
      category: r.category,
      amount: Number(r._sum.amount ?? 0),
      count: r._count,
    }));

    const totalIncome = income.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    return {
      income,
      expenses,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
    };
  }

  async getBalanceSheet(filter: PropertyFilter) {
    const propertyIds = filter.propertyId
      ? [filter.propertyId]
      : await this.getUserPropertyIds(filter.userId);

    if (propertyIds.length === 0) {
      return { assets: [], liabilities: [], totalAssets: 0, totalLiabilities: 0, equity: 0 };
    }

    const [allIncome, allExpenses, deposits] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          propertyId: { in: propertyIds },
          type: "INCOME",
          date: { lte: filter.endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          propertyId: { in: propertyIds },
          type: "EXPENSE",
          date: { lte: filter.endDate },
        },
        _sum: { amount: true },
      }),
      prisma.lease.aggregate({
        where: {
          propertyId: { in: propertyIds },
          status: "ACTIVE",
          depositPaid: true,
        },
        _sum: { depositAmount: true },
      }),
    ]);

    const totalIncome = Number(allIncome._sum.amount ?? 0);
    const totalExpenses = Number(allExpenses._sum.amount ?? 0);
    const depositLiability = deposits._sum.depositAmount ?? 0;

    const assets = [
      { name: "Cash & Equivalents", amount: totalIncome - totalExpenses },
      { name: "Accounts Receivable", amount: 0 },
    ];

    const liabilities = [
      { name: "Security Deposits Held", amount: depositLiability },
    ];

    const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);

    return {
      assets,
      liabilities,
      totalAssets,
      totalLiabilities,
      equity: totalAssets - totalLiabilities,
    };
  }

  async getCashFlowStatement(filter: PropertyFilter) {
    const propertyIds = filter.propertyId
      ? [filter.propertyId]
      : await this.getUserPropertyIds(filter.userId);

    if (propertyIds.length === 0) {
      return {
        operating: { inflows: 0, outflows: 0, net: 0 },
        months: [],
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        propertyId: { in: propertyIds },
        date: { gte: filter.startDate, lte: filter.endDate },
      },
      orderBy: { date: "asc" },
    });

    const monthlyMap = new Map<
      string,
      { income: number; expenses: number }
    >();

    let totalInflows = 0;
    let totalOutflows = 0;

    for (const tx of transactions) {
      const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, "0")}`;
      const entry = monthlyMap.get(key) ?? { income: 0, expenses: 0 };
      const amt = Number(tx.amount);

      if (tx.type === "INCOME") {
        entry.income += amt;
        totalInflows += amt;
      } else {
        entry.expenses += amt;
        totalOutflows += amt;
      }
      monthlyMap.set(key, entry);
    }

    const months = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }));

    return {
      operating: {
        inflows: totalInflows,
        outflows: totalOutflows,
        net: totalInflows - totalOutflows,
      },
      months,
    };
  }

  async getRentCollectionReport(filter: PropertyFilter) {
    const propertyIds = filter.propertyId
      ? [filter.propertyId]
      : await this.getUserPropertyIds(filter.userId);

    if (propertyIds.length === 0) {
      return {
        totalDue: 0,
        totalCollected: 0,
        totalPending: 0,
        totalOverdue: 0,
        collectionRate: 0,
        payments: [],
      };
    }

    const payments = await prisma.payment.findMany({
      where: {
        lease: { propertyId: { in: propertyIds } },
        type: "RENT",
        dueDate: { gte: filter.startDate, lte: filter.endDate },
      },
      include: {
        lease: {
          include: {
            property: { select: { id: true, title: true, address: true } },
            tenant: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    let totalDue = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    const paymentRows = payments.map((p) => {
      totalDue += p.amount;
      if (p.status === "PAID") totalCollected += p.amount;
      else if (p.status === "OVERDUE") totalOverdue += p.amount;
      else if (p.status === "PAYMENT_PENDING") totalPending += p.amount;

      return {
        id: p.id,
        propertyTitle: p.lease.property.title,
        propertyId: p.lease.property.id,
        tenantName: `${p.lease.tenant.firstName} ${p.lease.tenant.lastName}`,
        tenantEmail: p.lease.tenant.email,
        amount: p.amount,
        dueDate: p.dueDate,
        paidAt: p.paidAt,
        status: p.status,
      };
    });

    return {
      totalDue,
      totalCollected,
      totalPending,
      totalOverdue,
      collectionRate: totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0,
      payments: paymentRows,
    };
  }

  async getExpenseReport(filter: PropertyFilter) {
    const propertyIds = filter.propertyId
      ? [filter.propertyId]
      : await this.getUserPropertyIds(filter.userId);

    if (propertyIds.length === 0) {
      return { categories: [], total: 0, transactions: [] };
    }

    const [categoryAgg, transactions] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["category"],
        where: {
          propertyId: { in: propertyIds },
          type: "EXPENSE",
          date: { gte: filter.startDate, lte: filter.endDate },
        },
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: "desc" } },
      }),
      prisma.transaction.findMany({
        where: {
          propertyId: { in: propertyIds },
          type: "EXPENSE",
          date: { gte: filter.startDate, lte: filter.endDate },
        },
        include: {
          property: { select: { id: true, title: true } },
        },
        orderBy: { date: "desc" },
        take: 50,
      }),
    ]);

    const categories = categoryAgg.map((c) => ({
      category: c.category,
      amount: Number(c._sum.amount ?? 0),
      count: c._count,
    }));

    const total = categories.reduce((s, c) => s + c.amount, 0);

    const txRows = transactions.map((t) => ({
      id: t.id,
      propertyId: t.propertyId,
      propertyTitle: t.property.title,
      category: t.category,
      amount: Number(t.amount),
      date: t.date,
      description: t.description,
    }));

    return { categories, total, transactions: txRows };
  }

  async getProperties(userId: string) {
    return prisma.property.findMany({
      where: { ownerId: userId, deletedAt: null },
      select: { id: true, title: true, status: true },
      orderBy: { title: "asc" },
    });
  }
}

export default new AccountingService();
