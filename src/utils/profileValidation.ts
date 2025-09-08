import { FieldValidation } from "@/types/auth";

export const validateName = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, message: "Name is required." };
  }
  if (value.trim().length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long.",
    };
  }
  if (value.trim().length > 50) {
    return { isValid: false, message: "Name must be less than 50 characters." };
  }
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(value.trim())) {
    return {
      isValid: false,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes.",
    };
  }
  return { isValid: true, message: "" };
};

export const validateEmail = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, message: "Email is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return { isValid: false, message: "Please enter a valid email address." };
  }
  if (value.trim().length > 100) {
    return {
      isValid: false,
      message: "Email must be less than 100 characters.",
    };
  }
  return { isValid: true, message: "" };
};

export const validateDateOfBirth = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, message: "Date of birth is required." };
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { isValid: false, message: "Please enter a valid date." };
  }

  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  // Adjust age if birthday hasn't occurred this year
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())
      ? age - 1
      : age;

  if (actualAge < 13) {
    return { isValid: false, message: "You must be at least 13 years old." };
  }
  if (actualAge > 120) {
    return { isValid: false, message: "Please enter a valid date of birth." };
  }

  // Check if date is not in the future
  if (date > today) {
    return {
      isValid: false,
      message: "Date of birth cannot be in the future.",
    };
  }

  return { isValid: true, message: "" };
};

export const validateField = (
  field: string,
  value: string
): FieldValidation => {
  switch (field) {
    case "name":
      return validateName(value);
    case "email":
      return validateEmail(value);
    case "dateOfBirth":
      return validateDateOfBirth(value);
    default:
      return { isValid: false, message: "Invalid field type." };
  }
};
