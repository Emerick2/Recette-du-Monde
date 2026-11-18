'use client';
import {useState} from "react";
import {Recipe} from "../Interface";
import "./recipe.css";

// export default function Recette(data : Recipe) {
export default function Recette() {
    const [dishPortionSize, setDishPortionSize] = useState<number>(1);
    const [dishPortionSizeInput, setDishPortionSizeInput] = useState<string>("1");

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
        dish_ingredient: [
            {
                name:"Sucre",
                quantity:104,
                unit_of_measurement:"g",
            },
            {
                name:"Beurre",
                quantity:108,
                unit_of_measurement:"g",
            },
            {
                name:"Farine",
                quantity:215,
                unit_of_measurement:"g",
            },
            {
                name:"Oeuf",
                quantity:1,
                unit_of_measurement:"",
            },
            {
                name:"Sucre vanillé",
                quantity:1,
                unit_of_measurement:"",
            }
        ],
        notes : [2,3,3,3,1],
        preparation : [],
        product_thumbnail : "https://assets.afcdn.com/recipe/20190704/94700_w300h300c1cx2592cy1728cxt0cyt0cxb5184cyb3456.webp",
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
            {/* <article id="main-image-illustration-section">
                <img src={data.product_thumbnail} alt={"Illustration du plat : "+data.title}/>
            </article> */}
            <section id="quick-information-section">
                <img className="icone" alt="Icône du temps de préparation"/>
                <p>{data.preparation_time + data.cooking_time + data.rest_duration}</p>
                <span>•</span>
                <img className="icone" alt="Icône du niveau de difficulté"/>
                <p>{data.difficulty}</p>
                <span>•</span>
                <img className="icone" alt="Icône du prix de la recette"/>
                <p>{data.price}</p>
            </section>

            <section id="Ingredients section">
                <h2>Ingrédients</h2>
                <form>
                    <input type="button" value="-" onClick={() => {
                        if (dishPortionSize>1){
                            setDishPortionSize(dishPortionSize-1);
                            setDishPortionSizeInput((dishPortionSize-1).toString());
                        }
                    }}/>
                    <input type="number" value={dishPortionSizeInput}  onChange={(e) => {
                        const number = parseInt(e.target.value)
                        if (number == null || isNaN(number)){
                            setDishPortionSize(1);
                            setDishPortionSizeInput(e.target.value);
                        }
                        else if (number >= 1 && number<=999){
                            setDishPortionSize(number);
                            setDishPortionSizeInput(e.target.value);
                        }
                    }}/>
                    <input type="button" value="+" onClick={() => {
                        if (dishPortionSize<999){
                            setDishPortionSize(dishPortionSize+1);
                            setDishPortionSizeInput((dishPortionSize+1).toString());
                        }
                    }}/>
                </form>
                <p>{dishPortionSize}</p>
                <section id="the-ingredients">
                    {data.dish_ingredient.map((e, index) => (
                        <article key={index}>
                            <img alt={"Illustration de "+e.name} src={e.name}/>
                            <p>{e.quantity + " " +e.unit_of_measurement}</p>
                            <p>{e.name}</p>
                        </article>
                    ))}
                </section>
            </section>

            <section id="Preparation section">
                <h2>Préparation</h2>
                <article id="the-perparation">
                    <p>Temps total : {data.preparation_time + data.cooking_time + data.rest_duration}</p>
                    <hr/>
                    <div>
                        <article>
                            <p>Préparation :</p>
                            {data.preparation_time > 0 ? <p>{data.preparation_time} min</p> : <p>-</p>}
                        </article>
                        <article>
                            <p>Repos :</p>
                            {data.rest_duration > 0 ? <p>{data.rest_duration} min</p> : <p>-</p>}
                        </article>
                        <article>
                            <p>Cuisson :</p>
                            {data.cooking_time > 0 ? <p>{data.cooking_time} min</p> : <p>-</p>}
                        </article>
                    </div>
                </article>
            </section>
        </>
    );
}