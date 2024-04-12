import React, { useState, useEffect } from "react";
import AddPersonForm from "./components/AddPersonForm";
import PersonList from "./components/PersonList";
import UpdatePersonForm from "./components/UpdatedPersonForm";
import { addPerson, updatePerson, deletePerson } from "./services/api";
import { Person } from "./types/types";

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/fakes");
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddPerson = async (personData: {
    name: string;
    age: number;
    address: string;
    accountNumber: string;
    username: string;
    email: string;
    password: string;
    birthdate: string;
    registeredAt: string;
  }) => {
    try {
      const newPerson = await addPerson(personData);
      setPeople([...people, newPerson]);
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handleUpdatePerson = async (updatedPerson: Person) => {
    try {
      console.log("Updating person:", updatedPerson);
      await updatePerson(updatedPerson);
      console.log("Person updated successfully.");
      setPeople(
        people.map((person) =>
          person.id === updatedPerson.id ? updatedPerson : person
        )
      );
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  const handleDeletePerson = async (personId: number) => {
    try {
      await deletePerson(personId);
      setPeople(people.filter((person) => +person.id !== personId));
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const handleEditClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCancelEdit = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="heading-primary">CRUD Application</h1>
      {selectedPerson ? (
        <div>
          <h2 className="text-xl mt-8 mb-4">Edit Person</h2>
          <UpdatePersonForm
            person={selectedPerson}
            onSubmit={handleUpdatePerson}
          />
          <button className="btn mt-4" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mt-8 mb-4">Add Person</h2>
          <AddPersonForm onSubmit={handleAddPerson} />
        </div>
      )}
      <h2 className="text-xl mt-8 mb-4">People</h2>
      <PersonList
        onEditClick={handleEditClick}
        onDeleteClick={handleDeletePerson}
      />
    </div>
  );
};

export default App;