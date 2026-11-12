export interface DishIngredient {
    name:string,
    quantity:number,
    unit_of_measurement:string,
}

export interface Preparation {
    step_id : number,
    text : string,
}

export interface Recipe {
    author : User,
    dish_ingredient: DishIngredient[],
    notes : number[],
    preparation : Preparation[],
    product_thumbnail : string,
    title : string,
    visibility : 'visible' | 'cacher' | 'bannie',
    description : string,
    moment_category : 'entrée' | 'plat' | 'dessert',
    category_type : 'Pizzas'|'Salade verte'|'Soupe'|'Pain et fromages'|'Pâtes'|'Crudités'|'Charcuterie'|'Barbecue'|'Crêpes'|'Croque-monsieur'|'Quiches'|'Savoyard'|'Traditionnel'|'Pique-nique'|'Hamburgers'|'Brochettes'|'Gratin',
    original_category : 'Afrique'|'Amérique du Nord'|'Amérique du Sud'|'Antarctique'|'Asie'|'Europe'|'Océanie',
    season_category : 'été'|'automne'|'hiver'|'printemps',
    vegetarian:boolean,
    gluten_free:boolean,
    nut_free:boolean,
    preparation_time:number,
    cooking_time:number,
    rest_duration:number,
    personne:number,
    difficulty:'facile'|'moyen'|'difficile',
    price:'bon_marche'|'moyen'|'eleve',
}

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