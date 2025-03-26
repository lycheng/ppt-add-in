import * as React from "react";
import Header from "./Header";
import TopicInsertion from "./TopicInsertion";
import { makeStyles } from "@fluentui/react-components";
import { generateTOC, generatePPT} from "../taskpane";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="PPT Generator" />
      <TopicInsertion generateTOC={generateTOC} generatePPT={generatePPT}/>
    </div>
  );
};

export default App;
