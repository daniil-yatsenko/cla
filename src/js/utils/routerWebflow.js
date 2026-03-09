// code snippet for Webflow router
// should route between localhost:3000, prod/staging and prod/main
// make sure to update the CDN links and the port number

(function () {
  // update vars according to the project
  const srcProd = "https://XXX/prod-script.js";
  const srcStage = "https://XXX/stage-script.js";
  const port = "3000";

  const body = document.getElementsByTagName("body")[0];
  const isWebflow = window.location.hostname.includes("webflow.io");

  function loadScript(src, type = "text/javascript", module = false) {
    const script = document.createElement("script");
    script.src = src;
    script.type = module ? "module" : type;
    body.appendChild(script);
  }

  if (!isWebflow) {
    // if custom domain is connected, use prod script.
    loadScript(srcProd);
  } else {
    fetch(`https://localhost:${port}`) // if a webflow domain is connected, try localhost first.
      .then((response) => {
        if (response.ok) {
          loadScript(`https://localhost:${port}/@vite/client`, "module", true);
          loadScript(`https://localhost:${port}/js/index.js`, "module", true);
          console.log("using localhost scripts");
        } else {
          // if localhost is not available, use staging scripts.
          loadScript(srcStage);
          console.log("using CDN staging scripts");
        }
      })
      .catch(() => {
        loadScript(srcStage);
        console.log("using CDN staging scripts");
      });
  }
})();
