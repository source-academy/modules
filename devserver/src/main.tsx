import React from "react";
import ReactDOM from "react-dom";

import "./styles/index.scss";
import Playground from "./components/Playground";

ReactDOM.render(<React.StrictMode>
	<div className="Application">
		<div className="Application__main">
			<Playground />
		</div>
	</div>
</React.StrictMode>, document.getElementById("root")!);
