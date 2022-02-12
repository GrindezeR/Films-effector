import React, {ChangeEvent} from "react";
import {useStore} from "effector-react";
import "./Counter.css";
import {$store, searchButtonClicked, searchChange} from "./model";

export const Counter: React.FC<{ className: string }> = ({className}) => {
    const counterClasses = className ? `counter ${className}` : `counter`;
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => searchChange(e.currentTarget.value);
    const onClickHandler = () => {
        searchButtonClicked();
    }

    const store = useStore($store)
    return (
        <div className={counterClasses}>
            <input type="text" value={store.search} onChange={onChangeHandler}/>
            <button onClick={onClickHandler}>
                Search
            </button>
            <ul>
                {store.films.map((f, i) => {
                    return <li key={i}>
                        {f.Title}
                    </li>
                })}
            </ul>
        </div>
    );
};
