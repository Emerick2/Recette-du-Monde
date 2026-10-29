export interface User {
    id : number;
    name : string;
    email : string;
    profile_picture : string;
    description : string;
    professional : boolean;
    role : "utilisateur" | "administrateur" | "super_utilisateur";
    account_creation_date : string;
    hashed_password : string;
}

export interface UserDeletionRequest {
    idUser_deletion : number;
    hashed_user_want_deletion : string;
}

export interface UserLogin {
    email : string;
    hashed_password : string;
}