import React from "react";
import axios from "axios";

useEffect(() => {
  var myHeaders = new Headers();
      myHeaders.append("Authorization", BearerAlizonAccessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://alizon-server.herokuapp.com/api/sp-api-refresh-token", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => {
          console.log("error", error);
        });

  return () => {
    
  }
}, [])
