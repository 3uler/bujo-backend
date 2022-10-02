interface ILogin {
  email: string;
  password: string;
}

export const isLoginDto = (loginData: any): loginData is ILogin => {
  const candidate = loginData as ILogin;
  return (
    typeof candidate.email === "string" &&
    typeof candidate.password === "string"
  );
};

export default ILogin;
