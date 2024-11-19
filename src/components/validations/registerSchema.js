export const registerSchema = {
  first_name: {
      required: "First name is required",
      minLength: {
          value: 2,
          message: "First name must be at least 2 characters"
      }
  },
  last_name: {
      required: "Last name is required",
      minLength: {
          value: 2,
          message: "Last name must be at least 2 characters"
      }
  },
  email: {
      required: "Email is required",
      pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
      }
  },
  password: {
      required: "Password is required",
      minLength: {
          value: 8,
          message: "Password must be at least 8 characters"
      },
      pattern: {
          value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*])/,
          message: "Password must contain 1 uppercase letter and 1 special character"
      }
  },
  confirmPassword: {
      required: "Please confirm your password",
      validate: (value, formValues) => 
          value === formValues.password || "Passwords do not match"
  }
};