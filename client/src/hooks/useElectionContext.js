import { useContext } from "react";

import { ElectionContext } from "../context/ElectionContext";

const useElectionContext = () => {

  return useContext(ElectionContext);
};

export default useElectionContext;