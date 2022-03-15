const fs = require("fs");

const path = process.argv[2];
const name = process.argv[3];
const fullPath = `${path}/${name}`;
fs.mkdirSync(fullPath, { recursive: true });

const indexContent = `import React from "react";
// import styles from "./styles.module.less";

interface Props {}

export const ${name} = ({}: Props) => {
  return <div>${name}</div>;
};

export default ${name};
`;

fs.writeFileSync(`${fullPath}/index.tsx`, indexContent);
// fs.writeFileSync(`${fullPath}/styles.module.less`, '');
