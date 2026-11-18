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
        preparation : [
            {
                step_id : 1,
                text : "Casser l'oeuf dans un saladier, y ajouter une pincée de sel, le sucre et le sucre vanillé. Mélanger avec une cuillère de bois jusqu'à ce que l'appareil blanchisse.",
            },
            {
                step_id : 2,
                text : "Ajouter la farine, puis mélanger avec les doigts pour obtenir du sable.",
            },
            {
                step_id : 3,
                text : "Ajouter le beurre et pétrir pour obtenir une pâte bien homogène.",
            },
            {
                step_id : 4,
                text : "Frapper la pâte en la lançant d'une main à l'autre jusqu'à obtenir une boule régulière. Si la pâte semble trop grasse et molle, y rajouter un peu de farine.",
            },
            {
                step_id : 5,
                text : "Laisser reposer la pâte au réfrigérateur durant un quart d'heure. Préchauffer le four à 180°C (thermostat 6).",
            },
            {
                step_id : 6,
                text : "Etaler de la farine sur la table et sur le rouleau à pâtisserie, puis étaler la pâte sur 5 millimètres d'épaisseur.",
            },
            {
                step_id : 7,
                text : "Découper au couteau, à l'emporte-pièces ou avec un verre les formes que vous souhaitez.",
            },
            {
                step_id : 8,
                text : "Poser ces formes sur une tôle beurrée ou recouverte de papier sulfurisé.",
            },
            {
                step_id : 9,
                text : "Mettre à four durant 20 min.",
            },
        ],
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
            <section id="quick-information-section">
                <img className="icone" src="lunch-time.png" alt="Icône du temps de préparation"/>
                <p>{data.preparation_time + data.cooking_time + data.rest_duration}</p>
                <span>•</span>
                <img className="icone" src="difficulty.png" alt="Icône du niveau de difficulté"/>
                <p>{data.difficulty}</p>
                <span>•</span>
                <img className="icone" src="price.png" alt="Icône du prix de la recette"/>
                <p>{data.price}</p>
            </section>

            <section id="Ingredients section">
                <article className="name-of-a-part">
                    <img src="food-ingredient.png"/>
                    <h2>Ingrédients</h2>
                    <hr/>
                </article>
                <section className="part">
                    <form className="ingredients-quantity-form">
                        <input className="buttonUp" type="button" value="-" onClick={() => {
                            if (dishPortionSize>1){
                                setDishPortionSize(dishPortionSize-1);
                                setDishPortionSizeInput((dishPortionSize-1).toString());
                            }
                        }}/>
                        <input className="buttonText" type="number" value={dishPortionSizeInput}  onChange={(e) => {
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
                        <input className="buttonDown" type="button" value="+" onClick={() => {
                            if (dishPortionSize<999){
                                setDishPortionSize(dishPortionSize+1);
                                setDishPortionSizeInput((dishPortionSize+1).toString());
                            }
                        }}/>
                    </form>
                    <br/>
                    <section id="the-ingredients">
                        {data.dish_ingredient.map((e, index) => (
                            <article key={index} className="food-item">
                                <img alt={"Illustration de "+e.name} src={e.name}/>
                                <p>{e.quantity + " " +e.unit_of_measurement} de <span className="nameFood">{e.name}</span></p>
                            </article>
                        ))}
                    </section>
                </section>
            </section>

            <section id="Preparation section">
                <article className="name-of-a-part">
                    <img src="food-preparation.png"/>
                    <h2>Préparation</h2>
                    <hr/>
                </article>
                <article id="the-perparation" className="part">
                    <p>Temps total : {data.preparation_time + data.cooking_time + data.rest_duration}</p>
                    <hr/>
                    <div className="list-preparation">
                        <article>
                            <p className="name-preparation">Préparation :</p>
                            {data.preparation_time > 0 ? <p>{data.preparation_time} min</p> : <p>-</p>}
                        </article>
                        <article>
                            <p className="name-preparation">Repos :</p>
                            {data.rest_duration > 0 ? <p>{data.rest_duration} min</p> : <p>-</p>}
                        </article>
                        <article>
                            <p className="name-preparation">Cuisson :</p>
                            {data.cooking_time > 0 ? <p>{data.cooking_time} min</p> : <p>-</p>}
                        </article>
                    </div>
                </article>
                <section id="the-steps" className="part">
                    {data.preparation.map((e, index) => (
                        <article key={index}>
                            <p className="name-step">ÉTAPE {e.step_id}</p>
                            <p className="description-step">{e.text}</p>
                        </article>
                    ))}
                </section>
            </section>

        </>
    );
}