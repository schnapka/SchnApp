import Form from "./Form";

const Landing = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen text-text bg-primary">
      <div className="p-8 lg:p-20 lg:w-[500px]">
        <img className="mb-5 w-1/2" src="/logo.svg" alt="SchnApp!" />
        <h1 className="mt-10 mb-3 text-4xl">Spojte se jako nikdy předtím.</h1>
        <h2 className="mb-5 text-lg">Objevte místo, kde se komunita setkává, sdílí a roste.</h2>
        <Form />
      </div>
      <div className="hidden md:block w-1/2 p-8 lg:px-20 lg:py-10 text-center">
        <img className="max-h-[800px]" src="/hero-banner.png" alt="SchnApp!" />
      </div>
    </div>
  );
};

export default Landing;
