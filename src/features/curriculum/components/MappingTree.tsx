import type { CurriculumMappingNode } from "../types/curriculum.types";
import styles from "./curriculum.module.scss";

type MappingTreeProps = {
  nodes: CurriculumMappingNode[];
};

export function MappingTree({ nodes }: MappingTreeProps) {
  return (
    <div className={styles.mappingTree} aria-label="Curriculum competency mapping tree">
      {nodes.map((node) => (
        <MappingNodeView node={node} key={node.id} />
      ))}
    </div>
  );
}

function MappingNodeView({ node }: { node: CurriculumMappingNode }) {
  return (
    <article className={styles.mappingNode}>
      <p className={styles.title}>{node.label}</p>
      <p className={styles.meta}>{node.type}</p>
      {node.children?.length ? (
        <div className={styles.mappingChildren}>
          {node.children.map((child) => (
            <MappingNodeView node={child} key={child.id} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
