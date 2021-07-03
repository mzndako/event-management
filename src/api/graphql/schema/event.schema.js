exports.types = `
  scalar Date
  
  type SubEvent {
    subEventId: String
    event: Event
  }

  type Event {
    eventId: String
    name: String
    date: Date
    createdBy: String
    pictureUrl: String
    createdby: String
    subEvents: [SubEvent]
  }
`;

exports.queries = `
  getAllEvents(eventName: String, page: Int, perPage: Int): [Event]
`;
