class Person {
  name: string;
  email: string;
  password: string;
  #rol: string;
  id: number;
  constructor(
    name: string,
    email: string,
    password: string,
    rol: string,
    id: number
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.#rol = rol;
    this.id = id;
  }

  get rol(): string {
    return this.#rol;
  }
  set rol(value: string) {
    if (value !== "admin" && value !== "tutor" && value !== "participante") {
      throw new Error(
        'Invalid role. Must be "admin" or "participante" or "tutor".'
      );
    }
    this.#rol = value;
  }
}
