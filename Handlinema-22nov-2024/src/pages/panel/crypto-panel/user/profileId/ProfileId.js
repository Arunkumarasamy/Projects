import React from "react";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";
import ProfileIdDropdown from "./ProfileIdDropdown";
import { UserAvatar } from "../../../../../components/Component";
import axios from "axios";

function ProfileId() {

  const spAccessToken = localStorage.getItem("spAccessToken");
  const spId = localStorage.getItem("spId");

  const adsAccessToken = localStorage.getItem("adsAccessToken");
  const [adsConnected, setAdsConnected] = React.useState(localStorage.getItem("adsConnected"));

  const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
  const adsAtzAccessToken = localStorage.getItem("adsAtzAccessToken");

  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const BearerAlizonRefreshToken = "Bearer" + " " + localStorage.getItem("AlizonRefreshToken");
  const BearerAdsAccessToken = "Bearer" + " " + localStorage.getItem("adsAtzAccessToken");

  const profileId = localStorage.getItem("ProfileId");
  const [profileIds, setProfileIds] = React.useState([{}]);


  const getProfileIds = () => {
    const requestUrl = `https://advertising-api-eu.amazon.com/v2/profiles`;

    var body = JSON.stringify({
    });

    var data = JSON.stringify({
      url: requestUrl,
      ads_access_key: BearerAdsAccessToken,
      request_type: "GET",
      body: body,
    });
    
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://alizon-server.herokuapp.com/api/fetch-amazon-ads-profiles",
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        localStorage.setItem("adsConnected", true);
        setProfileIds(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  

  React.useEffect(() => {
    if (profileId === null) {
      localStorage.setItem("ProfileId", "ProfileId");
    }
    getProfileIds();
    
    return () => {};
  }, []);

  

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        tag="a"
        href="#toggle"
        onClick={(ev) => ev.preventDefault()}
        className="dropdown-toggle nk-quick-nav-icon"
      >
        <UserAvatar className="border border-light sm mr-1" size="xs">
        </UserAvatar>
        <span className="!font-bold text-xs">{profileId}</span>
      </DropdownToggle>
      <ProfileIdDropdown className="dropdown-menu-s1" profiles={profileIds} />
    </UncontrolledDropdown>
  );
}

export default ProfileId;
