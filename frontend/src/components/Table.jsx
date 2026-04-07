import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

function Table() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // for edit/delete
  const hasFetchedUsers = useRef(false);

  // Fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        console.log("Fetched data:", response.data);
        setUsers(response.data);

        if (!hasFetchedUsers.current) {
          toast.success("Data Fetched");
          hasFetchedUsers.current = true;
        }
      } catch (error) {
        console.error("There was an error fetching the users!", error);
        if (!hasFetchedUsers.current) {
          toast.error("Error Fetching Data");
          hasFetchedUsers.current = true;
        }
      }
    };

    fetchUsers();
  }, []);

  // Add user to table
  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  // Update user in table after edit
  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  // Remove user from table after delete
  const removeUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <>
      <Toaster richColors closeButton />
      <div className="container mt-5">
        <h1 className="mb-4" id="h1">
          User Table
        </h1>

        <CreateUserModal addUser={addUser} />
        <EditUserModal
          user={selectedUser}
          updateUser={updateUser}
          onClose={() => setSelectedUser(null)}
        />
        <DeleteUserModal
          user={selectedUser}
          removeUser={removeUser}
          onClose={() => setSelectedUser(null)}
        />

        {users.length === 0 ? (
          <h3 id="h3">No Users in Database</h3>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setSelectedUser(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Table;


























// //importing libraries, functional components for using them in a table which will show data from server
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// import EditUserModal from "./modals/EditUserModal";
// import CreateUserModal from "./modals/CreateUserModal";
// import DeleteUserModal from "./modals/DeleteUserModal";

// //creation of the parent functional component which will be pased to app.jsx
// function Table() {
//   //using use state, use ref for state variables and ref to track if fetch has already been attempted
//   const [users, setUsers] = useState([]);
//   const hasFetchedUsers = useRef(false);

//   //async await useEffect function for fetching data from server
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000");
//         //setting the empty array as a json object of users got from the server
//         setUsers(response.data);

//         //using the useRef current which is the same as initialized untill changes
//         if (!hasFetchedUsers.current) {
//           toast.success("Data Fetched");
//           hasFetchedUsers.current = true; // set the ref to true after first fetch
//         }
//       } catch (error) {
//         console.log("There was an error fetching the users!", error);

//         //if we haven't fetched it stay as it is
//         if (!hasFetchedUsers.current) {
//           toast.error("Error Fetching Data");
//           hasFetchedUsers.current = true; // set the ref to true after first fetch attempt
//         }
//       }
//     };

//     //calling the function here
//     fetchUsers();
//   }, []);

//   //after adding or creating a new user we normally would have to manually reload the page but with this function we just add the created user at the last of the fetched json object which we saved as an array
//   const addUser = (user) => {
//     setUsers((prevUsers) => [...prevUsers, user]);
//   };

//   //using bootstrap pre built components and modal components
//   return (
//     <>
//       <Toaster richColors closeButton />
//       <div className="container mt-5">
//         <h1 className="mb-4" id="h1">
//           User Table
//         </h1>
//         <CreateUserModal addUser={addUser} />
//         <EditUserModal />
//         <DeleteUserModal />

//         {users.length === 0 ? (
//           <h3 id="h3">No Users in Database</h3>
//         ) : (
//           <table className="table table-bordered table-hover">
//             <thead className="thead-dark">
//               <tr>
//                 <th>Id</th>
//                 <th>Name</th>
//                 <th>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.id}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// }


// //exporting the component to be using it in the app.jsx
// export default Table;
