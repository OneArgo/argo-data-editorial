<ul id="choose-your-tool" class="nav nav-tabs" role="tablist">
  <h3 class="no-anchor">Choose your tool</h3>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="jupyternotebook.html">
      <img src="../../assets/images/jupyterlogo.png">Jupyter book
    </a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="quartobook.html">
      <img src="../../assets/images/favicon.png">Quarto book
    </a>
  </li>
</ul>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
  // get file name
  const pathParts = window.location.pathname.split("/");
  const filename = pathParts.slice(-1);

  // latch active
  const toolLinks = window.document.querySelectorAll("#choose-your-tool a");
  for (const tool of toolLinks) {
    if (tool.href.endsWith(filename)) {
      tool.classList.add("active");
      break;
    }
  }

   // save in local storage
  window.localStorage.setItem("tutorialToolGetStarted", filename);
});
</script>
