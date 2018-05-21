import { withRouter } from "next/router";

const Destroyer = ({ href, router, dbRef, nextID }) => {
  const handleClick = e => {
    e.preventDefault();
    dbRef.remove();
    router.push(`${href}?id=${nextID}`);
  };
  return (
    <a href={`${href}?id=${nextID}`} onClick={handleClick}>
      Destroy
    </a>
  );
};

export default withRouter(Destroyer);
