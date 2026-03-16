// FILE PATH: src/modules/auth/utils/validation.ts
// Module 1.1: User Authentication & Management - Input Validation Utilities

export const validators = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * Returns validation result with specific error messages
   */
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)",
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate phone number format
   * Accepts international format with optional + prefix
   */
  phone: (phone: string): boolean => {
    // Remove formatting characters
    const cleanPhone = phone.replace(/[\s()-]/g, "");
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(cleanPhone);
  },

  /**
   * Validate name (first name, last name)
   */
  name: (name: string): boolean => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && trimmedName.length <= 50;
  },

  /**
   * Validate username (alphanumeric with underscores/hyphens)
   */
  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * Check password strength (weak, medium, strong)
   */
  getPasswordStrength: (password: string): "weak" | "medium" | "strong" => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  },

  /**
   * Validate that two passwords match
   */
  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
  },
};
