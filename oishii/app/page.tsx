'use client';
import {SyntheticEvent, useState} from 'react';

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");

  const HandleSubmitCreateAnAccount = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      hashed_password: formData.get('hashed_password') as string,
      professional: formData.get('professional') !== null,
    };

    setName(data.name);

    try {
      const response = await fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      if (!response.ok) {
        console.log("Statut HTTP :", response.status);
        alert("Erreur : "+result);
      } else {
        console.log('Succès :', result);
        setToken(result);
        alert('Compte créé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      alert("Une erreur est survenue lors de l'inscription.");
    }
  };



  const HandleSubmitLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get('email') as string,
      hashed_password: formData.get('hashed_password') as string,
    };

    try {
      const response = await fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      if (!response.ok) {
        console.log("Statut HTTP :", response.status);
        alert("Erreur : "+result);
      } else {
        console.log('Succès :', result);
        setToken(result);
        alert('Compte connecter avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      alert("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <>
      <main>
        <h2>Se créer un compte</h2>
        <form id="login-page" onSubmit={HandleSubmitCreateAnAccount}>
          <input name="name" type="text" minLength={3} placeholder="Votre nom" required />
          <input name="email" type="email" minLength={3} placeholder="Votre e-mail" required />
          <input name="hashed_password" type="password" minLength={8} placeholder="Votre mot de passe" required />
          <input name="professional" type="checkbox" id="professional" />
          <label htmlFor="professional">Vous êtes professionnel dans le milieu de la cuisine ?</label>
          <button type="submit">Envoyer</button>
        </form>

        <br/>

        <h2>Se connecter</h2>
        <form id="login-page" onSubmit={HandleSubmitLogin}>
          <input name="email" type="email" minLength={3} placeholder="Votre e-mail" required />
          <input name="hashed_password" type="password" minLength={8} placeholder="Votre mot de passe" required />
          <button type="submit">Envoyer</button>
        </form>

        {token == "" ? null :
        <>
          <h2>Bienvenu {name} !</h2>
        </>
        }
      </main>
    </>
  );
}