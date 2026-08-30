import {Subject} from "rxjs";

const subject = new Subject<{name: string, value: any} | null>();

export const messageService = {
    sendMessage: (name: string, value: any) => subject.next({name: name, value: value}),
    clearMessages: () => subject.next(null),
    getMessage: () => subject.asObservable()
};