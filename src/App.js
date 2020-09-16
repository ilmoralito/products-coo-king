import React, { useState } from "react";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const idOne = uuidv4();
const idTwo = uuidv4();
const idThree = uuidv4();

const initialState = [
  {
    id: idOne,
    name: "Nintendo switch",
    price: 250,
    quantity: 0,
    subTotal: 0
  },
  {
    id: idTwo,
    name: "Nintendo 3DS",
    price: 199,
    quantity: 0,
    subTotal: 0
  },
  {
    id: idThree,
    name: "playstation 4",
    price: 300,
    quantity: 0,
    subTotal: 0
  }
];

const productOneID = uuidv4();
const productTwoID = uuidv4();

let users = {
  [productOneID]: {
    id: productOneID,
    firstName: "Robin",
    lastName: "Wieruch",
    isDeveloper: true
  },
  [productTwoID]: {
    id: productTwoID,
    firstName: "Dave",
    lastName: "Davddis",
    isDeveloper: false
  }
};

function getUsers() {
  new Promise((resolve, reject) => {
    if (!users) {
      return reject(new Error("No initial state"));
    }

    setTimeout(() => resolve(users), 250);
  });
}

function getUser(id) {
  new Promise((resolve, reject) => {
    const user = users[id];

    if (!user) {
      return setTimeout(() => reject(new Error("User not found")));
    }

    setTimeout(() => resolve(user), 250);
  });
}

async function doGetUser(id) {
  try {
    const user = await getUser(id);

    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
}

function createUser(data) {
  new Promise((resolve, reject) => {
    const { firstName, lastName } = data;

    if (!firstName || !lastName) {
      reject(new Error("First name and last name are required"));
    }

    const id = uuidv4();
    const newUser = { id, firstName, lastName };

    users = { ...users, [id]: newUser };

    setTimeout(() => resolve(true), 250);
  });
}

async function doCreateUser(data) {
  try {
    const output = await createUser(data);

    console.log(output);
  } catch (error) {
    console.error(error.message);
  }
}

function updateUser(id, data) {
  new Promise((resolve, reject) => {
    if (!users[id]) {
      return setTimeout(() => reject(new Error("User not found")), 250);
    }

    users[id] = { ...users[id], ...data };

    return setTimeout(() => resolve(true), 250);
  });
}

async function doUpdateUser(id, data) {
  try {
    const output = await updateUser(id, data);

    console.log(output);
  } catch (error) {
    console.error(error.message);
  }
}

function deleteUser(id) {
  new Promise((resolve, reject) => {
    const { [id]: user, ...rest } = users;

    if (!user) {
      return setTimeout(() => reject(new Error("User not found")), 250);
    }

    users = { ...rest };

    return setTimeout(() => resolve(true), 250);
  });
}

const doDeleteUser = async id => {
  try {
    const result = await deleteUser(id);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

// DEMO APP

// HELPERS
function capitalize(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

function Totals({ products }) {
  function getTotal(key) {
    return products.reduce((previousValue, currentValue) => {
      return (previousValue += currentValue[key]);
    }, 0);
  }

  return (
    <tr>
      <td />
      <td>{getTotal("price")}</td>
      <td>{getTotal("quantity")}</td>
      <td>{getTotal("subTotal")}</td>
    </tr>
  );
}

function Product({ id, name, price, quantity, subTotal, onChange }) {
  function onChangePrice(event) {
    onChange({ id, price: event.target.value, quantity });
  }

  function onChangeQuantity(event) {
    onChange({ id, price, quantity: event.target.value });
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        <input onChange={onChangePrice} value={price} pattern="[0-9]*" />
      </td>
      <td>
        <input onChange={onChangeQuantity} value={quantity} pattern="[0-9]*" />
      </td>
      <td>{subTotal}</td>
    </tr>
  );
}

function SortByLink({ value, currentOrderBy, onSortBy }) {
  const [sortBy, setSortBy] = useState("desc");

  function onSortByHandler() {
    setSortBy(sortBy === "desc" ? "asc" : "desc");

    onSortBy({ value, sortBy });
  }

  return (
    <a onClick={onSortByHandler}>
      <span
        style={{ fontWeight: currentOrderBy === value ? "bold" : "normal" }}
      >
        {capitalize(value)}
      </span>
      {sortBy === "asc" ? <AiOutlineUp /> : <AiOutlineDown />}
    </a>
  );
}

function App() {
  const [products, setProducts] = useState(initialState);
  const [orderBy, setOrderBy] = useState("name");
  const [sortBy, setSortBy] = useState("asc");

  function onChangeHandler(entry) {
    const output = products.map(product =>
      product.id === entry.id
        ? {
            ...product,
            price: +entry.price,
            quantity: +entry.quantity,
            subTotal: +entry.price * +entry.quantity
          }
        : product
    );

    setProducts(output);
  }

  function onSortByHandler({ value, sortBy }) {
    setOrderBy(value);
    setSortBy(sortBy);
    updateProducts();
  }

  function updateProducts() {
    const clone = products.concat();

    if (sortBy === "asc") {
      clone.sort((a, b) => {
        if (a[orderBy] > b[orderBy]) return 1;

        if (a[orderBy] < b[orderBy]) return -1;

        return 0;
      });
    }

    if (sortBy === "desc") {
      clone.sort((a, b) => {
        if (b[orderBy] > a[orderBy]) return 1;

        if (b[orderBy] < a[orderBy]) return -1;

        return 0;
      });
    }

    setProducts(clone);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
            <SortByLink
              value="name"
              currentOrderBy={orderBy}
              onSortBy={onSortByHandler}
            />
          </th>
          <th>
            <SortByLink
              value="price"
              currentOrderBy={orderBy}
              onSortBy={onSortByHandler}
            />
          </th>
          <th>
            <SortByLink
              value="quantity"
              currentOrderBy={orderBy}
              onSortBy={onSortByHandler}
            />
          </th>
          <th>
            <SortByLink
              value="subTotal"
              currentOrderBy={orderBy}
              onSortBy={onSortByHandler}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <Product key={product.id} {...product} onChange={onChangeHandler} />
        ))}
        <Totals products={products} />
      </tbody>
    </table>
  );
}

export default App;
