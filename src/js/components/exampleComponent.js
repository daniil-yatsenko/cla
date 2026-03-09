export const exampleComponent = () => {
  const element = document.querySelector(".example-component");

  if (!element) return;

  // Example event listener
  element.addEventListener("click", () => {
    console.log("Example component clicked!");
  });
};
