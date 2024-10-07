import mysql from 'mysql2/promise';
import 'dotenv/config';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

export class AttendanceModel {

    static async getUserActionStatus({uuid, action}) {
        const connection = await mysql.createConnection(config);
        // if(uuid === 'be463301-5da7-4492-8b6a-2b2ddd16f507'){            
        //     const [checkIns] = await connection.query('INSERT INTO users_check_ins_noche_industriales (user_id, action) VALUES (?, ?)', [0, action]);
        //     if(checkIns.affectedRows === 0){
        //         return {
        //             status: false,
        //             message: 'Error al registrar entrada'
        //         }
        //     }
        //     return {
        //         message: 'Invitado especial',
        //         status: true
        //     }
        // }

        try {
            const [result] = await connection.query(' SELECT id, uuid, name, paternSurname, maternSurname,institution FROM users_students WHERE uuid = ? ', [uuid]);

            if(result.length > 0){                
                const [serarchUser] = await connection.query('SELECT * from users_check_ins WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1', [result[0].id] );                

                if(serarchUser.length > 0 && serarchUser[0].action === action){
                    return {
                        result: result[0],
                        status: false,  
                        message: 'Ya se ha registrado tu ' + action + ' no puedes realizar la misma acción'
                    }
                }

                const [checkIns] = await connection.query('INSERT INTO users_check_ins (user_id, action) VALUES (?, ?)', [result[0].id, action]);

                if(checkIns.affectedRows === 0){
                    return {
                        status: false,
                        message: 'Error al registrar entrada'
                    }
                }

                return {
                    result: result[0],
                    message: 'Usuario encontrado',
                    status: true
                }
            }else{
                return {
                    status: false,
                    message: 'Usuario no encontrado / codigo invalido'              
                };
            }               
        } catch (error) {
            console.log(error)
            return {
                status: false,
            }
        } finally {
            await connection.end(); // Close the connection
        }
  }
    
}