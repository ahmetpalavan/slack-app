type WorkspaceProps = {
  params: { workspaceId: string };
};

const Workspace = ({ params: { workspaceId } }: WorkspaceProps) => {
  console.log('🚀 ~ Workspace ~ workspaceId:', workspaceId);
  return <div>Workspace</div>;
};

export default Workspace;
