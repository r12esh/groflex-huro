import React, { useEffect, useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { Button } from "../../shared/components/button/Button";
import { ListAdvancedComponent } from "../../shared/components/list-advanced/ListAdvancedComponent";
import { useNavigate } from "react-router-dom";
import config from "../../../../newConfig";
import InviteCaModal from "./InviteCaModal";
import InviteNewUserModal from "./InviteNewUserModal";
import groflexService from "../../services/groflex.service";

import EditRoleModal from "./EditRoleModal";
import DeleteUserModal from "./DeleteUserModal";
const actions = [
  { name: "Edit", icon: "edit" },
  { name: "Delete", icon: "trash-alt" },
];
const Teams = () => {
  const [isCaModalVisible, setIsCaModalVisible] = useState(false);
  const [isNewUserModalVisible, setIsNewUserModalVisible] = useState(false);
  const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
  const [isDeleteUserModalVisible, setIsDeleteUserModalVisible] =
    useState(false);
  const [caExists, setCaExists] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserList();
  }, []);

  const deleteUser = () => {};

  const handleActionClick = (action, row, params) => {
    switch (action.name) {
      case "Delete":
        setUserData(row);
        setIsDeleteUserModalVisible(true);
        break;
      case "Edit":
        setUserData(row);
        setIsEditRoleModalVisible(true);
    }
  };

  const fetchUserList = () => {
    groflexService
      .request(config.resourceUrls.teamsList, { auth: true })
      .then((res) => {
        const roles = res.body.data.roles;
        const caRole = roles.filter(
          (name) => name.role === "charteredaccountant"
        );
        if (caRole[0].users.length === 0) {
          setCaExists(false);
        }
      });
  };

  const createTopbarButtons = () => {
    return (
      <div className="task-overview-buttons">
        {!caExists && (
          <Button onClick={() => setIsCaModalVisible(true)} isSuccess>
            Invite CA
          </Button>
        )}

        <Button onClick={() => setIsNewUserModalVisible(true)} isSuccess>
          Invite New User
        </Button>
      </div>
    );
  };
  return (
    <PageContent
      title="Teams"
      titleIsBreadCrumb
      breadCrumbData={["Home", "Teams"]}
      titleActionContent={createTopbarButtons()}
    >
      <ListAdvancedComponent
        isFilter={false}
        pagination={false}
        onRowClicked={(e) => {}}
        onActionClick={handleActionClick}
        columnDefs={[
          {
            field: "firstName",
            headerName: "User's Name",
            cellRenderer: (evt) => {
              const {
                firstName,
                lastName,
                isCurrent,
                hasConfirmedEmail,
                isExpired,
                email,
              } = evt.data;

              if (isCurrent) {
                return `<b>${firstName} ${lastName} (You)</b>`;
              } else if (!hasConfirmedEmail) {
                return "-";
              }
              return `${firstName} ${lastName}`;
            },
          },
          {
            headerName: "Role",
            field: "role",

            cellRenderer: (evt) => {
              if (evt.value[0] === "charteredaccountant") {
                return "Chartered Accountant";
              }
              return (
                evt.value[0].charAt(0).toUpperCase() + evt.value[0].slice(1)
              );
            },
          },
          {
            headerName: "Email",
            field: "email",
          },
          {
            headerName: "Status",
            field: "status",

            cellRenderer: (evt) => {
              const { hasConfirmedEmail, isExpired } = evt.data;
              if (hasConfirmedEmail) {
                return "Accepted";
              } else if (!hasConfirmedEmail && isExpired) {
                return "Expired";
              } else if (!hasConfirmedEmail && !isExpired) {
                return "Invitation sent";
              }
            },
          },
        ]}
        fetchUrl={config.resourceUrls.teamsList}
        actionMenuData={actions}
        responseDataMapFunc={(userList) => {
          const rolesList = userList.roles;
          const allUsersList = [];
          if (rolesList && rolesList.length > 0) {
            rolesList.forEach((role) => {
              role.users.forEach((user) => {
                if (user.isCurrent) return;
                allUsersList.push(user);
              });
            });
          }

          if (allUsersList && allUsersList.length > 0) {
            return allUsersList;
          }
          return [];
        }}
      />
      <InviteCaModal
        isCaModalVisible={isCaModalVisible}
        setIsCaModalVisible={setIsCaModalVisible}
      />
      <InviteNewUserModal
        isNewUserModalVisible={isNewUserModalVisible}
        setIsNewUserModalVisible={setIsNewUserModalVisible}
      />

      <EditRoleModal
        isEditRoleModalVisible={isEditRoleModalVisible}
        setIsEditRoleModalVisible={setIsEditRoleModalVisible}
        userData={userData}
      />

      <DeleteUserModal
        isDeleteUserModalVisible={isDeleteUserModalVisible}
        setIsDeleteUserModalVisible={setIsDeleteUserModalVisible}
        userData={userData}
      />
    </PageContent>
  );
};

export default Teams;
