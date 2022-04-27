export default (_request, customTags, HTML) => `
  ${customTags.style}
  <div id=${customTags.elementId}>
   ${HTML}
  </div>
  ${customTags.hydrationScript}
`;
