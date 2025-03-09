function Error({ invalid }) {
  return (
    <>
      {invalid != "" ? (
        <ul className="invalid_form">
          {invalid.map((e, i) => {
            return <li key={i}>{e}</li>;
          })}
        </ul>
      ) : (
        ""
      )}
    </>
  );
}

export default Error;
