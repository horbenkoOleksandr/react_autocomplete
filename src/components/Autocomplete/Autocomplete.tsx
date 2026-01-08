import React, { useCallback, useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { SuggestionsList } from "../SuggestionsList";
import { Person } from "../../types/Person";

type Props = {
    allPeople: Person[];
    delay?: number;
    onSelected: (person: Person) => void;
    setSelectPerson: (value: Person | null) => void;
}
export const Autocomplete: React.FC<Props> = (
    {allPeople,
     delay=300,
     onSelected = () => {},
     setSelectPerson = () => {}
    }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const applyQuery = useCallback(
        debounce((value: string) => {
            setAppliedQuery(value)
        }, delay), [delay]
    );

    useEffect(() => {
        return () => {
            applyQuery.cancel();
        };
    }, [applyQuery]);

    const filteredPeople = useMemo(() => {
        return allPeople.filter((people) => people.name.toLowerCase().includes(appliedQuery.toLowerCase()));
    }, [appliedQuery, allPeople]);

    const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectPerson(null);
        setQuery(value);

        if (value !== appliedQuery) {
            applyQuery(value);
        }
    };

    const handlerSuggestion = (person: Person) => {
        setQuery(person.name);
        setIsFocused(false);
        setAppliedQuery('');
        onSelected(person);
    }
    
  return (
    <>
        <div className="dropdown is-active">
            <div className="dropdown-trigger">
                <input
                  type="text"
                  placeholder="Enter a part of the name"
                  className="input"
                  data-cy="search-input"
                  value={query}
                  onChange={handlerInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
            </div>

            {isFocused && (
                query === ''
                 ? <SuggestionsList 
                      allPeople={allPeople} 
                      handlerSuggestionItem={handlerSuggestion}
                    />
                 : <SuggestionsList 
                      allPeople={filteredPeople}
                      handlerSuggestionItem={handlerSuggestion}
                    />
            )}

        </div>
        
        {query.trim() !== '' && filteredPeople.length === 0 && (
            <div
                className="
                  notification
                  is-danger
                  is-light
                  mt-3
                  is-align-self-flex-start
                "
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
            </div>
        )}
    </> 
  )
}