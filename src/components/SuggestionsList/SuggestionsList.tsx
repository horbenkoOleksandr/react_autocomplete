import React from "react";
import { Person } from "../../types/Person";

type Props = {
    allPeople: Person[]
    handlerSuggestionItem: (person: Person) => void
};

export const SuggestionsList: React.FC<Props> = (
    {allPeople,
     handlerSuggestionItem = () => {}
    }) => {
    return (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {allPeople.map((people) => (
                <div 
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.slug}
                  onMouseDown={() => handlerSuggestionItem(people)}
                >
                    <p className="has-text-link">{people.name}</p>
                </div>
              ))}
            </div>
          </div>
    )
}