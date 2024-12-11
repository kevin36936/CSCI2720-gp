const fs = require('fs');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Event = require('./models/Event'); // Import your Event schema

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cultural_programs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to parse XML and save events to MongoDB
async function parseAndSaveEvents() {
  const parser = new xml2js.Parser({
    explicitArray: false, // Prevents arrays for single elements
    emptyTag: null, // Sets empty tags to null
  });

  try {
    // Clear the collection before inserting new data
    await Event.deleteMany({});
    console.log('Cleared the Event collection.');

    // Read the XML file
    const data = fs.readFileSync('./datasets/events.xml', 'utf8');

    // Parse the XML data
    const result = await parser.parseStringPromise(data);

    // Access the events array from the parsed data
    const events = result.events.event;

    // Iterate over each event and extract relevant fields
    for (const event of events) {
      const newEvent = new Event({
        id: event.$.id || 'NULL', // Extract event ID or set as "NULL"
        title: event.titlee || 'NULL', // English title
        dateTime: event.predateE || 'NULL', // Date and time in English
        duration: event.progtimee || 'NULL', // Duration in English
        venueId: event.venueid || 'NULL', // Venue ID
        description: event.desce || 'NULL', // Description in English
        presenter: event.presenterorge || 'NULL', // Presenter in English
      });

      // Save the event to MongoDB
      await newEvent.save();
      console.log(`Saved event with ID: ${event.$.id}`);
    }

    console.log('All events have been saved to MongoDB.');
  } catch (err) {
    console.error('Error parsing or saving events:', err);
  } finally {
    mongoose.connection.close(); // Close MongoDB connection when done
  }
}

// Run the function
parseAndSaveEvents();
