export default function isValidPassword(password: string): boolean {
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
   return passwordRegex.test(password);
};