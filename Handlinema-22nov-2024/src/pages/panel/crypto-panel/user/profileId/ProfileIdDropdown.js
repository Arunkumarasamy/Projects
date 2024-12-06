import React from "react";
import { DropdownItem, DropdownMenu } from "reactstrap";

function ProfileIdDropdown({ className, size, profiles }) {
  const ProfileIdSelect = (profileId) => {
    localStorage.setItem("ProfileId", profileId);
    window.location.reload();
    console.log(profileId);
  };

  return (
    <DropdownMenu right className={`${size ? `dropdown-menu-${size}` : ""} ${className ? className : ""}`}>
      <ul className="profile-list">
        {profiles.map((profile, index) => (
          <li key={`profile-${index}`}>
            <DropdownItem
              tag="a"
              href="#item"
              className="profile-item"
              onClick={() => ProfileIdSelect(profile.profileId)}
            >
              <span className="profile-name">{`${profile.countryCode} | ${
                profile.accountInfo ? profile.accountInfo.name : ""
              }`}</span>
            </DropdownItem>
          </li>
        ))}
      </ul>
    </DropdownMenu>
  );
}

export default ProfileIdDropdown;
