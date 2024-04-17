// React komponenta pro patičku
const Footer = () => {
  return (
    <footer className="bg-secondary p-4 text-center">
      <p>&copy; {new Date().getFullYear()} SchnApp!</p>
    </footer>
  );
};

export default Footer;
