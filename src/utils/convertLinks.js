/**
 * Konvertuje všechny URL odkazy v textu na HTML odkazy.
 * Tato funkce hledá URL podle běžného vzoru a nahrazuje je HTML `<a>` tagy,
 * které otevřou odkaz v novém záložce prohlížeče. Tím se zlepšuje uživatelská
 * zkušenost tím, že umožňuje uživatelům kliknout na odkazy přímo v textu.
 *
 * @param {string} text Text, který může obsahovat URL odkazy.
 * @return {string} Text s URL odkazy nahrazenými za HTML `<a>` tagy.
 */
const convertLinks = (text) => {
  // Regulární výraz pro identifikaci URL odkazů v textu.
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  // Nahrazení všech nalezených URL odkazů HTML `<a>` tagy.
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

// Export funkce pro použití v jiných částech aplikace.
export default convertLinks;
