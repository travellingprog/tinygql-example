(function () {
  const gql = new TinyGQL();

  gql.storeFragment(`
    fragment companyFragment on CompanyType {
      companyId
      name
    }
  `);

  let query = `
    {
      listCompany {
        ...companyFragment
      }
    }
  `;

  gql.send({ query }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log('company list', data);
    }
  });

  const errorWrapper = function(dataHandler) {
    return function (err, data) {
      if (err) {
        console.log('err.name', err.name);
        throw err;
      } else {
        dataHandler(data);
      }
    }
  };

  const processCompanyList = errorWrapper(data => {
    console.log('updated company list', data);
  });

  const getUpdatedCompanyList = function() {
    gql.send({ query }, processCompanyList);
  };

  const processData = errorWrapper(data => {
    console.log('new company', data);
    getUpdatedCompanyList();
  });

  gql.send({
    mutation: `mutation CreateCompany($name: String!) {
      createCompany(name: $name) {
        ...companyFragment
      }
    }`,

    variables: { name: 'Tech Underground' },
  // }, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('new company', data);

  //     gql.send({ request }, (err, data) => {
  //       console.log('updated company list', data);
  //     });
  //   }
  // });
  }, processData);

})()