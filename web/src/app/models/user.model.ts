export class LoginModel {
    id: number = null;
    msg: string = null;
    name: string = null;
    perfil: number = null;
    token: string = null;
}
export class UserModel {
    id: number = null;
    nome: string = null;
    sobrenome: string = null;
    data_nascimento: string = null;
    linguagem_favorita: string = null;
    obs: string = null;
    active = false;
    idade: any = null;
}