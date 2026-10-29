export default function Home() {
  return (
    <>
      <main>
        <form id="login-page">
          <input name="name" type="text" placeholder="Votre nom"></input>
          <input name="email" type="email" placeholder="Votre e-mail"></input>
          <input name="hashed_password" type="password" placeholder="Votre mot de passe"></input>
          <input name="professional" type="checkbox"></input><label>Vous êtes professionnel dans le milieu de la cuisine ?</label>
          <button type="submit">Envoyer</button>
        </form>
      </main>
    </>
  );
}