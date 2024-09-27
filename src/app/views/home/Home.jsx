import React from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";

const Home = () => {
  return (
    <PageContent
      breadCrumbIcon={
        <FeatherIcon
          color="#272D30"
          name="Home"
          size={18}
          style={{ marginRight: "10px" }}
        />
      }
      breadCrumbData={["Home"]}
      title="Home page"
    >
      this is home page
    </PageContent>
  );
};

export default Home;
