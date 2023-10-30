export const reformatAgreementData = (data, user) =>
  data.reduce((acc, ob) => {
    const { id } = ob;
    const userCategory = ob[`user${user}_category_id`];

    if (!userCategory) {
      return { ...acc };
    }

    return { ...acc, [id]: userCategory };
  }, {});

export const calculatePercentAgreement = (data1, data2) => {
  let numAgreements;
  let total;

  const getNumOfAgreements = (ref, comp) => {
    const agreements = Object.keys(ref).reduce((acc, key) => {
      if (ref[key] === comp[key]) {
        acc += 1;
      }
      return acc;
    }, 0);

    return [agreements, Object.keys(ref).length];
  };

  if (Object.keys(data1).length <= Object.keys(data2).length) {
    [numAgreements, total] = getNumOfAgreements(data1, data2);
  } else {
    [numAgreements, total] = getNumOfAgreements(data2, data1);
  }

  return Math.round((numAgreements / total) * 100) / 100;
};
