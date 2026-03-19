#!/bin/bash
#
# PostgreSQL Database Backup Script for RealEstate AI
#
# Usage: ./backup_db.sh <db_name> <db_user> <db_password> <backup_path>

set -euo pipefail

# --- Configuration ---
DB_NAME="${1:-}"
DB_USER="${2:-}"
DB_PASSWORD="${3:-}"
BACKUP_DIR="${4:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/backup.log"
TIMESTAMP="$(date '+%Y-%m-%d-%H-%M-%S')"
BACKUP_FILENAME="real-estate-ai-backup-${TIMESTAMP}.sql.gz"

# --- Logging ---
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] $*" | tee -a "${LOG_FILE}"
}

log_error() { log "ERROR" "$@"; }
log_info()  { log "INFO"  "$@"; }

# --- Validation ---
if [[ -z "${DB_NAME}" || -z "${DB_USER}" || -z "${DB_PASSWORD}" || -z "${BACKUP_DIR}" ]]; then
    log_error "Missing required arguments."
    echo "Usage: $0 <db_name> <db_user> <db_password> <backup_path>" >&2
    exit 1
fi

if ! command -v pg_dump &>/dev/null; then
    log_error "pg_dump is not installed or not in PATH."
    exit 1
fi

# Check database connectivity
export PGPASSWORD="${DB_PASSWORD}"
if ! pg_isready -h "${DB_HOST:-db}" -U "${DB_USER}" -d "${DB_NAME}" -q 2>/dev/null; then
    log_error "Cannot connect to database '${DB_NAME}' as user '${DB_USER}'. Check credentials and that the database is running."
    unset PGPASSWORD
    exit 1
fi

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILENAME}"

# --- Backup ---
log_info "Starting backup of database '${DB_NAME}' to '${BACKUP_FILE}'."

if pg_dump -h "${DB_HOST:-db}" -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${BACKUP_FILE}"; then
    BACKUP_SIZE="$(stat -c '%s' "${BACKUP_FILE}" 2>/dev/null || stat -f '%z' "${BACKUP_FILE}" 2>/dev/null || echo 'unknown')"

    if [[ "${BACKUP_SIZE}" == "0" || "${BACKUP_SIZE}" == "unknown" ]]; then
        log_error "Backup file is empty or size could not be determined."
        unset PGPASSWORD
        exit 1
    fi

    log_info "Backup completed successfully. File: ${BACKUP_FILE} (${BACKUP_SIZE} bytes)."
else
    log_error "pg_dump failed for database '${DB_NAME}'."
    rm -f "${BACKUP_FILE}"
    unset PGPASSWORD
    exit 1
fi

unset PGPASSWORD
log_info "Backup process finished."
