import {createEffect, createEvent, createStore, forward, sample} from "effector";

//Events
export const searchChange = createEvent<string>('onChange input value');
export const searchButtonClicked = createEvent();
const searchReset = createEvent<string>();

searchChange.watch(() => console.log('Change'))
//watch - подписка на событие, когда выполниться searchChange -> выведи console.log()

//Effects
const startSearchFx = createEffect<string, void, Error>({
    handler: (value) => {
        console.log('Поиск начался!', value);
    },
});
const setFilmsDataFx = createEvent<film[]>();

export const getFilm = createEffect<string, void, Error>({
    handler: async (value: string) => {
        let response = await fetch(`https://www.omdbapi.com/?apikey=48c63132&s=${value}`);
        let result = await response.json();
        setFilmsDataFx(result.Search);

        // fetch(`https://www.omdbapi.com/?apikey=48c63132&s=ass`, {
        //     method: 'GET',
        // })
        //     .then(res => res.json()
        //         .then(res => setFilmsDataFx(res.Search)))
    }
});

//Store
export const $store = createStore<InitialStateType>({
    search: '',
    films: [],
})
    .on(
        searchChange,
        (state, value) => ({...state, search: value})

        //Не должен возвращать undefined, если вернет его,
        //то ничего не произойдет и останется предыдущее значение через ?? в этом случае,
        //можно присвоить null
    )
    .on(setFilmsDataFx, (state, data: film[]) => {
        return {
            ...state,
            films: data
        }
    })
    .reset(searchReset)//По вызову вернет изначальное значение которое было в store ''

//forward связывает события, когда произойдет from:Event, то запустится to:Event
forward({from: startSearchFx, to: searchReset});


//sample позволяет положить что-то куда-то в определенное время
sample({source: $store.map(t => t.search), target: startSearchFx, clock: searchButtonClicked})
sample({source: $store.map(s => s.search), target: getFilm, clock: searchButtonClicked})

//source - описывает какие данные нужно взять
//target  - описывает куда деть данные из source
//clock - описывает когда это нужно сделать

type InitialStateType = {
    search: string
    films: film[]
}

type film = {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
}