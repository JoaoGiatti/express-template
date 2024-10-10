import {Request, RequestHandler, Response} from "express";
import OracleDB from "oracledb";

/*
    Nampespace que contém tudo sobre "contas de usuários"
*/
export namespace AccountsHandler {
    
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

    /**
     * Tipo UserAccount
     */
    export type UserAccount = {
        id: number | undefined;
        completeName: string;
        email: string;
        password: string | undefined; 
    };

    async function login(
        email: string,
        password: string
    ): Promise<UserAccount | undefined> {
        // passo 1 — conectar-se ao oracle
        let connection = await OracleDB.getConnection({
            user: "ADMIN",
            password: "123",
            connectString: "Minha string de conexão..."
        });

        let results = await connection.execute(
            'SELECT * FROM ACCOUNTS WHERE email = :email AND password = :password',
            [email, password]
        );

        console.dir(results.rows);
        if(results.rows?.length === undefined){
            return undefined;
        }else{
            // retornar a conta
            console.dir(results.rows);
        }
    }

    export const loginHandler: RequestHandler =
        async (req: Request, res: Response) => {
            // tratar rota login.
            const pEmail = req.get('emial');
            const pPassword = req.get('password');
            if(pEmail && pPassword){
                //chamar a funcao de login
                await login(pEmail, pPassword);
                res.statusCode = 200;
                res.send('Login realizado... Confira...')
            }else{
                res.statusCode =  400;
                res.send('Requisição inválida — Parâmetros faltando.')
            }
        }
}