import {Recipe} from "../Interface";
import "./recipe.css";

// export default function Recette(data : Recipe) {
export default function Recette() {
    // Recette exemple :
    const data : Recipe = {
        author : {
            id : 0,
            name : "mon nom",
            email : "le mail",
            profile_picture : "",
            description : "",
            professional : false,
            role : "utilisateur",
            account_creation_date : "",
            hashed_password : "",
        },
        dish_ingredient: [],
        notes : [2,3,3,3,1],
        preparation : [],
        product_thumbnail : "",
        title : "Biscuits sablés au beurre",
        visibility : 'visible',
        description : "",
        moment_category : 'dessert',
        category_type : 'Pain et fromages',
        original_category : 'Europe',
        season_category : 'automne',
        vegetarian:true,
        gluten_free:true,
        nut_free:true,
        preparation_time:20,
        cooking_time:20,
        rest_duration:0,
        personne:1,
        difficulty:'facile',
        price:'bon_marche',
    }
    


    return (
        <>
            <h2>{data.title}</h2>
            <article>
                <img src={data.product_thumbnail} alt={"Illustration du plat : "+data.title}/>
            </article>
            <section>
                <p>{data.preparation_time + data.cooking_time + data.rest_duration}</p>
                <p>{data.difficulty}</p>
                <p>{data.price}</p>
            </section>
        </>
    );
}