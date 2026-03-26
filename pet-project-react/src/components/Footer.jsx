import React from "react";

function Footer() {
  return React.createElement("footer", { className: "site-footer" },
    React.createElement("div", { className: "footer-container" },
      React.createElement("div", { className: "footer-section" },
        React.createElement("h3", null, "Pet Adoption"),
        React.createElement("p", null, "Finding loving homes for pets in need.")
      ),
      React.createElement("div", { className: "footer-section" },
        React.createElement("h4", null, "Quick Links"),
        React.createElement("ul", { className: "footer-links-vertical" },
          React.createElement("li", null, 
            React.createElement("a", { href: "/" }, "Home")
          ),
          React.createElement("li", null, 
            React.createElement("a", { href: "/about" }, "About")
          ),
          React.createElement("li", null, 
            React.createElement("a", { href: "/login" }, "Login")
          )
        )
      ),
      React.createElement("div", { className: "footer-section" },
        React.createElement("h4", null, "Contact"),
        React.createElement("p", null, "Email: info@petadoption.com"),
        React.createElement("p", null, "Phone: +254 757445696")
      )
    ),
    React.createElement("div", { className: "footer-bottom" },
      React.createElement("p", null, "© 2026 PetAdopt. All rights reserved.")
    )
  );
}

export default Footer;
