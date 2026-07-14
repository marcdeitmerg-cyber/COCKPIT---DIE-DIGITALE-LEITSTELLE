"use client";

import { useEffect, useMemo, useState } from "react";

const NAVIGATION = [
  ["dashboard", "Dashboard", "home"],
  ["disposition", "Disposition", "calendar"],
  ["vehicles", "Fahrzeuge", "bus"],
  ["calculation", "Kalkulation", "calculator"],
  ["drivers", "Fahrer", "user"],
  ["recurring", "Dauerfahrten", "repeat"],
  ["vacation", "Urlaubskalender", "vacation"],
  ["requests", "Anfragen", "inbox"],
  ["driverApp", "Fahrer-App", "phone"],
  ["reports", "Auswertung", "chart"],
];

const WEEKDAYS = [
  { id: 1, short: "Mo", long: "Montag" },
  { id: 2, short: "Di", long: "Dienstag" },
  { id: 3, short: "Mi", long: "Mittwoch" },
  { id: 4, short: "Do", long: "Donnerstag" },
  { id: 5, short: "Fr", long: "Freitag" },
  { id: 6, short: "Sa", long: "Samstag" },
  { id: 0, short: "So", long: "Sonntag" },
];

const EMPTY_TRIP = {
  date: "2026-07-17",
  approachStart: "08:30",
  start: "09:00",
  end: "10:00",
  title: "",
  customer: "",
  origin: "",
  destination: "",
  vehicleId: "v1",
  driverId: "d1",
  status: "Geplant",
  isRecurring: false,
  weekdays: [1, 2, 3, 4, 5],
  notes: "",
};


const DEFAULT_CALCULATION = {
  depreciation: 3333,
  insurance: 2000,
  vehicleTax: 600,
  standbyCosts: 500,
  administration: 4000,
  fuelEnergy: 8000,
  maintenance: 2000,
  tires: 600,
  cleaning: 1500,
  annualKilometers: 40000,
  personnelPerHour: 23,
  orderKilometers: 68,
  orderHours: 1.5,
  profitPercent: 40,
  profitTiers: [
    { id: "tier-1", fromKm: 0, toKm: 40, percent: 40 },
    { id: "tier-2", fromKm: 40.01, toKm: 100, percent: 30 },
    { id: "tier-3", fromKm: 100.01, toKm: "", percent: 20 },
  ],
  vatPercent: 19,
};

function createCalculationProfile(overrides = {}) {
  const tiers =
    overrides.profitTiers ||
    DEFAULT_CALCULATION.profitTiers;

  return {
    ...DEFAULT_CALCULATION,
    ...overrides,
    profitTiers: tiers.map((tier) => ({ ...tier })),
  };
}

const INITIAL_DATA = {
  vehicles: [
    {
      id: "v1",
      name: "Vito 1",
      plate: "HSK-AR 101",
      seats: 8,
      status: "Verfügbar",
      tuv: "2026-09-12",
      mileage: 98235,
    },
    {
      id: "v2",
      name: "Vito 2",
      plate: "HSK-AR 102",
      seats: 8,
      status: "Verfügbar",
      tuv: "2026-11-04",
      mileage: 81420,
    },
    {
      id: "v3",
      name: "Linienbus 1",
      plate: "HSK-AR 201",
      seats: 49,
      status: "Im Einsatz",
      tuv: "2026-08-20",
      mileage: 245300,
    },
    {
      id: "v4",
      name: "Linienbus 2",
      plate: "HSK-AR 202",
      seats: 49,
      status: "Werkstatt",
      tuv: "2026-10-18",
      mileage: 219800,
    },
  ],
  calculations: {
    v1: createCalculationProfile(),
    v2: createCalculationProfile({
      depreciation: 3600,
      insurance: 2100,
      fuelEnergy: 8500,
      annualKilometers: 42000,
    }),
    v3: createCalculationProfile({
      depreciation: 12000,
      insurance: 5200,
      vehicleTax: 1200,
      standbyCosts: 1200,
      fuelEnergy: 26000,
      maintenance: 6500,
      tires: 4200,
      cleaning: 3600,
      annualKilometers: 65000,
      personnelPerHour: 26,
      orderKilometers: 120,
      orderHours: 3,
      profitPercent: 35,
    }),
    v4: createCalculationProfile({
      depreciation: 12000,
      insurance: 5200,
      vehicleTax: 1200,
      standbyCosts: 1200,
      fuelEnergy: 26000,
      maintenance: 6500,
      tires: 4200,
      cleaning: 3600,
      annualKilometers: 65000,
      personnelPerHour: 26,
      orderKilometers: 120,
      orderHours: 3,
      profitPercent: 35,
    }),
  },
  drivers: [
    {
      id: "d1",
      name: "Müller",
      employment: "Minijob",
      phone: "0170 000000",
      status: "Im Einsatz",
      permitUntil: "2028-04-30",
    },
    {
      id: "d2",
      name: "Schmidt",
      employment: "Minijob",
      phone: "0171 000000",
      status: "Verfügbar",
      permitUntil: "2027-08-31",
    },
    {
      id: "d3",
      name: "Becker",
      employment: "Festangestellt",
      phone: "0172 000000",
      status: "Im Einsatz",
      permitUntil: "2029-01-31",
    },
    {
      id: "d4",
      name: "Hoffmann",
      employment: "Reserve",
      phone: "0173 000000",
      status: "Urlaub",
      permitUntil: "2026-11-20",
    },
  ],
  trips: [
    {
      id: "t1",
      date: "2026-07-17",
      approachStart: "05:50",
      start: "06:20",
      end: "08:00",
      title: "Schülerverkehr Bad Fredeburg",
      customer: "Dauerfahrt",
      origin: "Betriebshof",
      destination: "Bad Fredeburg",
      vehicleId: "v1",
      driverId: "d1",
      status: "Geplant",
      isRecurring: true,
      weekdays: [1, 2, 3, 4, 5],
      notes: "",
    },
    {
      id: "t2",
      date: "2026-07-17",
      approachStart: "06:30",
      start: "07:00",
      end: "09:00",
      title: "Kindergarten Gleidorf",
      customer: "Dauerfahrt",
      origin: "Schmallenberg",
      destination: "Gleidorf",
      vehicleId: "v2",
      driverId: "d2",
      status: "Geplant",
      isRecurring: true,
      weekdays: [1, 2, 3, 4, 5],
      notes: "",
    },
  ],
  recurringTrips: [
    {
      id: "r1",
      sourceTripId: "t1",
      title: "Schülerverkehr Bad Fredeburg",
      customer: "Dauerfahrt",
      approachStart: "05:50",
      start: "06:20",
      end: "08:00",
      origin: "Betriebshof",
      destination: "Bad Fredeburg",
      vehicleId: "v1",
      driverId: "d1",
      status: "Geplant",
      weekdays: [1, 2, 3, 4, 5],
      notes: "",
      active: true,
    },
    {
      id: "r2",
      sourceTripId: "t2",
      title: "Kindergarten Gleidorf",
      customer: "Dauerfahrt",
      approachStart: "06:30",
      start: "07:00",
      end: "09:00",
      origin: "Schmallenberg",
      destination: "Gleidorf",
      vehicleId: "v2",
      driverId: "d2",
      status: "Geplant",
      weekdays: [1, 2, 3, 4, 5],
      notes: "",
      active: true,
    },
  ],
  absences: [
    {
      id: "a1",
      driverId: "d4",
      type: "Urlaub",
      recurrence: "once",
      weekdays: [],
      startDate: "2026-07-13",
      endDate: "2026-07-24",
      allDay: true,
      fromTime: "00:00",
      toTime: "23:59",
      approval: "Genehmigt",
      notes: "Sommerurlaub",
    },
    {
      id: "a2",
      driverId: "d2",
      type: "Frei",
      recurrence: "weekly",
      weekdays: [2],
      startDate: "2026-07-01",
      endDate: "2026-12-31",
      allDay: false,
      fromTime: "12:00",
      toTime: "17:00",
      approval: "Genehmigt",
      notes: "Jeden Dienstag nicht verfügbar",
    },
  ],
  requests: [
    {
      id: "q1",
      customer: "Musikverein",
      title: "Tagesfahrt Winterberg",
      date: "2026-09-20",
      people: 48,
      source: "Telefon",
      status: "Neu",
    },
  ],
};


function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue(value));
}

function normalizeProfitTiers(profile) {
  const source =
    Array.isArray(profile.profitTiers) &&
    profile.profitTiers.length
      ? profile.profitTiers
      : DEFAULT_CALCULATION.profitTiers;

  return source
    .map((tier, index) => ({
      id: tier.id || `tier-${index + 1}`,
      fromKm: Math.max(0, numberValue(tier.fromKm)),
      toKm:
        tier.toKm === "" ||
        tier.toKm === null ||
        tier.toKm === undefined
          ? ""
          : Math.max(0, numberValue(tier.toKm)),
      percent: Math.max(0, numberValue(tier.percent)),
    }))
    .sort((first, second) => first.fromKm - second.fromKm);
}

function getAppliedProfitTier(profile) {
  const kilometers = Math.max(
    0,
    numberValue(profile.orderKilometers)
  );
  const tiers = normalizeProfitTiers(profile);

  const matchingTier = tiers.find((tier) => {
    const hasNoUpperLimit = tier.toKm === "";
    return (
      kilometers >= tier.fromKm &&
      (hasNoUpperLimit || kilometers <= tier.toKm)
    );
  });

  return (
    matchingTier ||
    tiers[tiers.length - 1] || {
      id: "fallback",
      fromKm: 0,
      toKm: "",
      percent: numberValue(profile.profitPercent),
    }
  );
}

function calculateVehicleCosts(profile) {
  const fixedCosts =
    numberValue(profile.depreciation) +
    numberValue(profile.insurance) +
    numberValue(profile.vehicleTax) +
    numberValue(profile.standbyCosts) +
    numberValue(profile.administration);

  const variableCosts =
    numberValue(profile.fuelEnergy) +
    numberValue(profile.maintenance) +
    numberValue(profile.tires) +
    numberValue(profile.cleaning);

  const annualKilometers = Math.max(
    1,
    numberValue(profile.annualKilometers)
  );

  const fixedPerKilometer = fixedCosts / annualKilometers;
  const variablePerKilometer = variableCosts / annualKilometers;
  const operatingCostPerKilometer =
    fixedPerKilometer + variablePerKilometer;

  const routeCosts =
    numberValue(profile.orderKilometers) *
    operatingCostPerKilometer;

  const personnelCosts =
    numberValue(profile.orderHours) *
    numberValue(profile.personnelPerHour);

  const orderCosts = routeCosts + personnelCosts;
  const costPerOrderKilometer =
    numberValue(profile.orderKilometers) > 0
      ? orderCosts / numberValue(profile.orderKilometers)
      : 0;

  const appliedProfitTier = getAppliedProfitTier(profile);
  const appliedProfitPercent = appliedProfitTier.percent;

  const netPrice =
    orderCosts *
    (1 + appliedProfitPercent / 100);

  const grossPrice =
    netPrice * (1 + numberValue(profile.vatPercent) / 100);

  return {
    fixedCosts,
    variableCosts,
    annualCosts: fixedCosts + variableCosts,
    fixedPerKilometer,
    variablePerKilometer,
    operatingCostPerKilometer,
    routeCosts,
    personnelCosts,
    orderCosts,
    costPerOrderKilometer,
    appliedProfitTier,
    appliedProfitPercent,
    netPrice,
    grossPrice,
  };
}

function createId(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

function toMinutes(value) {
  if (!value || !value.includes(":")) return 0;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function tripBlockStart(trip) {
  return trip.approachStart || trip.start;
}

function tripsOverlap(first, second) {
  if (first.date !== second.date) return false;

  return (
    toMinutes(tripBlockStart(first)) < toMinutes(second.end) &&
    toMinutes(tripBlockStart(second)) < toMinutes(first.end)
  );
}

function formatDate(value) {
  if (!value) return "–";

  return new Intl.DateTimeFormat("de-DE").format(
    new Date(`${value}T12:00:00`)
  );
}

function formatWeekdays(values = []) {
  return WEEKDAYS.filter((day) => values.includes(day.id))
    .map((day) => day.short)
    .join(", ");
}

function dateIsWithin(date, startDate, endDate) {
  return Boolean(
    date &&
      startDate &&
      endDate &&
      date >= startDate &&
      date <= endDate
  );
}

function weekdayForDate(date) {
  return new Date(`${date}T12:00:00`).getDay();
}

function absenceOccursOnDate(absence, date) {
  if (!dateIsWithin(date, absence.startDate, absence.endDate)) return false;

  if (absence.recurrence === "weekly") {
    return (absence.weekdays || []).includes(weekdayForDate(date));
  }

  return true;
}

function absenceStartMinutes(absence) {
  return absence.allDay ? 0 : toMinutes(absence.fromTime || "00:00");
}

function absenceEndMinutes(absence) {
  return absence.allDay ? 24 * 60 : toMinutes(absence.toTime || "23:59");
}

function absenceConflictsWithTrip(absence, trip) {
  if (absence.driverId !== trip.driverId) return false;
  if (absence.approval !== "Genehmigt") return false;
  if (!absenceOccursOnDate(absence, trip.date)) return false;

  const tripStart = toMinutes(tripBlockStart(trip));
  const tripEnd = toMinutes(trip.end);

  return (
    tripStart < absenceEndMinutes(absence) &&
    absenceStartMinutes(absence) < tripEnd
  );
}

function absenceTimeText(absence) {
  if (absence.allDay) return "Ganztags";
  return `${absence.fromTime} – ${absence.toTime}`;
}

function monthDays(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const totalDays = new Date(year, month, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${year}-${String(month).padStart(2, "0")}-${day}`;
  });
}

function mondayOffsetForMonth(monthValue) {
  const firstDay = new Date(`${monthValue}-01T12:00:00`).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
}

function nextDateForWeekday(startDate, weekday) {
  const result = new Date(startDate);
  const current = result.getDay();
  const difference = (weekday - current + 7) % 7;
  result.setDate(result.getDate() + difference);
  return result;
}

export default function Home() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(INITIAL_DATA);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-07-17");
  const [vacationMonth, setVacationMonth] = useState("2026-07");
  const [selectedDriver, setSelectedDriver] = useState("d1");
  const [selectedCalculationVehicle, setSelectedCalculationVehicle] =
    useState("v1");
  const [editingTripId, setEditingTripId] = useState(null);

  const [tripForm, setTripForm] = useState(EMPTY_TRIP);

  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    plate: "",
    seats: 8,
    status: "Verfügbar",
    tuv: "",
    mileage: 0,
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    employment: "Minijob",
    phone: "",
    status: "Verfügbar",
    permitUntil: "",
  });

  const [absenceForm, setAbsenceForm] = useState({
    driverId: "d1",
    type: "Urlaub",
    recurrence: "once",
    weekdays: [2],
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    allDay: true,
    fromTime: "08:00",
    toTime: "13:00",
    approval: "Genehmigt",
    notes: "",
  });

  const [requestForm, setRequestForm] = useState({
    customer: "",
    title: "",
    date: "",
    people: 8,
    source: "Telefon",
    status: "Neu",
  });

  useEffect(() => {
    const stored = localStorage.getItem("cockpit-calculation-profit-tiers-v1");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({
          ...INITIAL_DATA,
          ...parsed,
          vehicles: parsed.vehicles || INITIAL_DATA.vehicles,
          calculations: Object.fromEntries(
            Object.entries({
              ...INITIAL_DATA.calculations,
              ...(parsed.calculations || {}),
            }).map(([vehicleId, profile]) => [
              vehicleId,
              createCalculationProfile(profile),
            ])
          ),
          drivers: parsed.drivers || INITIAL_DATA.drivers,
          trips: parsed.trips || INITIAL_DATA.trips,
          recurringTrips:
            parsed.recurringTrips || INITIAL_DATA.recurringTrips,
          absences: parsed.absences || INITIAL_DATA.absences,
          requests: parsed.requests || INITIAL_DATA.requests,
        });
      } catch {
        setData(INITIAL_DATA);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cockpit-calculation-profit-tiers-v1", JSON.stringify(data));
    }
  }, [data, loaded]);

  const vehicleMap = useMemo(
    () => Object.fromEntries(data.vehicles.map((vehicle) => [vehicle.id, vehicle])),
    [data.vehicles]
  );

  const driverMap = useMemo(
    () => Object.fromEntries(data.drivers.map((driver) => [driver.id, driver])),
    [data.drivers]
  );


  const selectedCalculationProfile =
    data.calculations?.[selectedCalculationVehicle] ||
    createCalculationProfile();

  const calculationResults = useMemo(
    () => calculateVehicleCosts(selectedCalculationProfile),
    [selectedCalculationProfile]
  );

  const conflictMap = useMemo(() => {
    const result = new Map();

    data.trips.forEach((trip) => {
      const absence = data.absences.find((item) =>
        absenceConflictsWithTrip(item, trip)
      );

      if (absence) {
        result.set(
          trip.id,
          `${driverMap[trip.driverId]?.name || "Fahrer"}: ${absence.type}`
        );
      }
    });

    data.trips.forEach((first, firstIndex) => {
      data.trips.slice(firstIndex + 1).forEach((second) => {
        if (!tripsOverlap(first, second)) return;

        const reasons = [];

        if (first.vehicleId === second.vehicleId) {
          reasons.push("Fahrzeug");
        }

        if (first.driverId === second.driverId) {
          reasons.push("Fahrer");
        }

        if (reasons.length) {
          result.set(first.id, reasons.join(" und "));
          result.set(second.id, reasons.join(" und "));
        }
      });
    });

    return result;
  }, [data.trips, data.absences, driverMap]);

  const dayTrips = data.trips
    .filter((trip) => trip.date === selectedDate)
    .sort((first, second) =>
      tripBlockStart(first).localeCompare(tripBlockStart(second))
    );

  const currentAbsences = data.absences.filter(
    (absence) =>
      absence.approval === "Genehmigt" &&
      absenceOccursOnDate(absence, selectedDate)
  );

  const driverTrips = data.trips
    .filter((trip) => trip.driverId === selectedDriver)
    .sort((first, second) =>
      `${first.date}${tripBlockStart(first)}`.localeCompare(
        `${second.date}${tripBlockStart(second)}`
      )
    );

  const calendarDays = monthDays(vacationMonth);
  const monthOffset = mondayOffsetForMonth(vacationMonth);

  const pageTitle =
    NAVIGATION.find(([key]) => key === page)?.[1] || "Dashboard";

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function toggleTripWeekday(dayId) {
    setTripForm((current) => ({
      ...current,
      weekdays: current.weekdays.includes(dayId)
        ? current.weekdays.filter((id) => id !== dayId)
        : [...current.weekdays, dayId],
    }));
  }

  function toggleAbsenceWeekday(dayId) {
    setAbsenceForm((current) => ({
      ...current,
      weekdays: current.weekdays.includes(dayId)
        ? current.weekdays.filter((id) => id !== dayId)
        : [...current.weekdays, dayId],
    }));
  }

  function validateTrip(candidate) {
    if (
      !candidate.date ||
      !candidate.title.trim() ||
      !candidate.start ||
      !candidate.end
    ) {
      return "Bitte Datum, Auftrag, Fahrtbeginn und Fahrtende ausfüllen.";
    }

    if (
      candidate.approachStart &&
      toMinutes(candidate.approachStart) > toMinutes(candidate.start)
    ) {
      return "Die Anfahrt muss vor oder genau zum Fahrtbeginn beginnen.";
    }

    if (toMinutes(candidate.end) <= toMinutes(candidate.start)) {
      return "Das Fahrtende muss nach dem Fahrtbeginn liegen.";
    }

    if (candidate.isRecurring && candidate.weekdays.length === 0) {
      return "Bitte mindestens einen Wochentag auswählen.";
    }

    const absenceConflict = data.absences.find((absence) =>
      absenceConflictsWithTrip(absence, candidate)
    );

    if (absenceConflict) {
      return `Der Fahrer ist nicht verfügbar: ${absenceConflict.type}, ${absenceTimeText(
        absenceConflict
      )}.`;
    }

    const tripConflict = data.trips.find(
      (trip) =>
        trip.id !== candidate.id &&
        tripsOverlap(trip, candidate) &&
        (trip.driverId === candidate.driverId ||
          trip.vehicleId === candidate.vehicleId)
    );

    if (tripConflict) {
      return `Konflikt inklusive Anfahrt mit „${tripConflict.title}“.`;
    }

    return "";
  }

  function saveTrip(event) {
    event.preventDefault();

    const candidate = {
      ...tripForm,
      id: editingTripId || createId("t"),
      weekdays: tripForm.isRecurring ? tripForm.weekdays : [],
    };

    const error = validateTrip(candidate);

    if (error) {
      showToast(error);
      return;
    }

    setData((current) => {
      const trips = editingTripId
        ? current.trips.map((trip) =>
            trip.id === editingTripId ? candidate : trip
          )
        : [...current.trips, candidate];

      let recurringTrips = current.recurringTrips.filter(
        (template) => template.sourceTripId !== candidate.id
      );

      if (candidate.isRecurring) {
        recurringTrips = [
          ...recurringTrips,
          {
            id:
              current.recurringTrips.find(
                (template) => template.sourceTripId === candidate.id
              )?.id || createId("r"),
            sourceTripId: candidate.id,
            title: candidate.title,
            customer: candidate.customer,
            approachStart: candidate.approachStart,
            start: candidate.start,
            end: candidate.end,
            origin: candidate.origin,
            destination: candidate.destination,
            vehicleId: candidate.vehicleId,
            driverId: candidate.driverId,
            status: candidate.status,
            weekdays: candidate.weekdays,
            notes: candidate.notes,
            active: true,
          },
        ];
      }

      return {
        ...current,
        trips,
        recurringTrips,
      };
    });

    setEditingTripId(null);
    setTripForm({
      ...EMPTY_TRIP,
      date: selectedDate,
    });

    showToast("Fahrt wurde gespeichert.");
  }

  function editTrip(trip) {
    setTripForm({
      ...EMPTY_TRIP,
      ...trip,
      weekdays: trip.weekdays || [],
    });
    setEditingTripId(trip.id);
    setPage("disposition");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTrip(tripId) {
    if (!window.confirm("Fahrt wirklich löschen?")) return;

    setData((current) => ({
      ...current,
      trips: current.trips.filter((trip) => trip.id !== tripId),
      recurringTrips: current.recurringTrips.filter(
        (template) => template.sourceTripId !== tripId
      ),
    }));

    showToast("Fahrt wurde gelöscht.");
  }


  function updateCalculation(field, value) {
    setData((current) => ({
      ...current,
      calculations: {
        ...(current.calculations || {}),
        [selectedCalculationVehicle]: {
          ...createCalculationProfile(),
          ...(current.calculations?.[selectedCalculationVehicle] || {}),
          [field]: value,
        },
      },
    }));
  }

  function updateProfitTier(tierId, field, value) {
    setData((current) => {
      const currentProfile = createCalculationProfile(
        current.calculations?.[selectedCalculationVehicle] || {}
      );

      return {
        ...current,
        calculations: {
          ...(current.calculations || {}),
          [selectedCalculationVehicle]: {
            ...currentProfile,
            profitTiers: currentProfile.profitTiers.map((tier) =>
              tier.id === tierId
                ? {
                    ...tier,
                    [field]:
                      field === "toKm" && value === ""
                        ? ""
                        : value,
                  }
                : tier
            ),
          },
        },
      };
    });
  }

  function addProfitTier() {
    setData((current) => {
      const currentProfile = createCalculationProfile(
        current.calculations?.[selectedCalculationVehicle] || {}
      );
      const sortedTiers = normalizeProfitTiers(currentProfile);
      const lastTier = sortedTiers[sortedTiers.length - 1];
      const suggestedFrom =
        lastTier && lastTier.toKm !== ""
          ? numberValue(lastTier.toKm) + 0.01
          : 0;

      return {
        ...current,
        calculations: {
          ...(current.calculations || {}),
          [selectedCalculationVehicle]: {
            ...currentProfile,
            profitTiers: [
              ...currentProfile.profitTiers,
              {
                id: createId("tier-"),
                fromKm: suggestedFrom,
                toKm: "",
                percent: 20,
              },
            ],
          },
        },
      };
    });
  }

  function deleteProfitTier(tierId) {
    setData((current) => {
      const currentProfile = createCalculationProfile(
        current.calculations?.[selectedCalculationVehicle] || {}
      );

      if (currentProfile.profitTiers.length <= 1) {
        showToast("Mindestens eine Gewinnstufe muss bestehen bleiben.");
        return current;
      }

      return {
        ...current,
        calculations: {
          ...(current.calculations || {}),
          [selectedCalculationVehicle]: {
            ...currentProfile,
            profitTiers: currentProfile.profitTiers.filter(
              (tier) => tier.id !== tierId
            ),
          },
        },
      };
    });
  }

  function resetCalculation() {
    if (
      !window.confirm(
        "Kalkulationswerte für dieses Fahrzeug zurücksetzen?"
      )
    ) {
      return;
    }

    setData((current) => ({
      ...current,
      calculations: {
        ...(current.calculations || {}),
        [selectedCalculationVehicle]: createCalculationProfile(),
      },
    }));

    showToast("Kalkulation wurde zurückgesetzt.");
  }

  function saveVehicle(event) {
    event.preventDefault();

    if (!vehicleForm.name.trim()) {
      showToast("Bitte einen Fahrzeugnamen eingeben.");
      return;
    }

    const newVehicleId = createId("v");

    setData((current) => ({
      ...current,
      vehicles: [
        ...current.vehicles,
        {
          ...vehicleForm,
          id: newVehicleId,
          seats: Number(vehicleForm.seats),
          mileage: Number(vehicleForm.mileage),
        },
      ],
      calculations: {
        ...(current.calculations || {}),
        [newVehicleId]: createCalculationProfile(),
      },
    }));

    setVehicleForm({
      name: "",
      plate: "",
      seats: 8,
      status: "Verfügbar",
      tuv: "",
      mileage: 0,
    });

    showToast("Fahrzeug wurde gespeichert.");
  }

  function saveDriver(event) {
    event.preventDefault();

    if (!driverForm.name.trim()) {
      showToast("Bitte einen Fahrernamen eingeben.");
      return;
    }

    setData((current) => ({
      ...current,
      drivers: [
        ...current.drivers,
        {
          ...driverForm,
          id: createId("d"),
        },
      ],
    }));

    setDriverForm({
      name: "",
      employment: "Minijob",
      phone: "",
      status: "Verfügbar",
      permitUntil: "",
    });

    showToast("Fahrer wurde gespeichert.");
  }

  function validateAbsence(candidate) {
    if (
      !candidate.driverId ||
      !candidate.startDate ||
      !candidate.endDate
    ) {
      return "Bitte Fahrer, Beginn und Ende ausfüllen.";
    }

    if (candidate.endDate < candidate.startDate) {
      return "Das Enddatum muss nach dem Beginn liegen.";
    }

    if (
      candidate.recurrence === "weekly" &&
      candidate.weekdays.length === 0
    ) {
      return "Bitte mindestens einen Wochentag auswählen.";
    }

    if (
      !candidate.allDay &&
      toMinutes(candidate.toTime) <= toMinutes(candidate.fromTime)
    ) {
      return "Die Bis-Uhrzeit muss nach der Von-Uhrzeit liegen.";
    }

    return "";
  }

  function saveAbsence(event) {
    event.preventDefault();

    const candidate = {
      ...absenceForm,
      id: createId("a"),
      weekdays:
        absenceForm.recurrence === "weekly"
          ? absenceForm.weekdays
          : [],
    };

    const error = validateAbsence(candidate);

    if (error) {
      showToast(error);
      return;
    }

    const affectedTrips = data.trips.filter((trip) =>
      absenceConflictsWithTrip(
        {
          ...candidate,
          approval: "Genehmigt",
        },
        trip
      )
    );

    setData((current) => ({
      ...current,
      absences: [...current.absences, candidate],
    }));

    setVacationMonth(candidate.startDate.slice(0, 7));

    setAbsenceForm((current) => ({
      ...current,
      notes: "",
    }));

    showToast(
      affectedTrips.length
        ? `Abwesenheit gespeichert. ${affectedTrips.length} Fahrt(en) sind betroffen.`
        : "Abwesenheit wurde gespeichert."
    );
  }

  function deleteAbsence(absenceId) {
    if (!window.confirm("Abwesenheit wirklich löschen?")) return;

    setData((current) => ({
      ...current,
      absences: current.absences.filter(
        (absence) => absence.id !== absenceId
      ),
    }));

    showToast("Abwesenheit wurde gelöscht.");
  }

  function saveRequest(event) {
    event.preventDefault();

    if (!requestForm.customer.trim() || !requestForm.title.trim()) {
      showToast("Bitte Kunde und Auftrag eingeben.");
      return;
    }

    setData((current) => ({
      ...current,
      requests: [
        ...current.requests,
        {
          ...requestForm,
          id: createId("q"),
          people: Number(requestForm.people),
        },
      ],
    }));

    setRequestForm({
      customer: "",
      title: "",
      date: "",
      people: 8,
      source: "Telefon",
      status: "Neu",
    });

    showToast("Anfrage wurde gespeichert.");
  }

  function requestToTrip(request) {
    setTripForm({
      ...EMPTY_TRIP,
      date: request.date,
      title: request.title,
      customer: request.customer,
      notes: `${request.people} Personen · Quelle: ${request.source}`,
      weekdays: [],
      isRecurring: false,
    });

    setData((current) => ({
      ...current,
      requests: current.requests.map((item) =>
        item.id === request.id
          ? { ...item, status: "Übernommen" }
          : item
      ),
    }));

    setPage("disposition");
    showToast("Anfrage wurde in das Fahrtformular übernommen.");
  }

  function generateNextWeek() {
    const reference = new Date(`${selectedDate}T12:00:00`);
    const monday = new Date(reference);
    const currentWeekday = monday.getDay();
    const daysUntilMonday = currentWeekday === 0 ? 1 : 8 - currentWeekday;

    monday.setDate(monday.getDate() + daysUntilMonday);

    const generatedTrips = [];
    const simulatedTrips = [...data.trips];

    data.recurringTrips
      .filter((template) => template.active)
      .forEach((template) => {
        template.weekdays.forEach((weekday) => {
          const date = nextDateForWeekday(monday, weekday);
          const dateString = date.toISOString().slice(0, 10);

          const candidate = {
            id: createId("t"),
            date: dateString,
            approachStart: template.approachStart,
            start: template.start,
            end: template.end,
            title: template.title,
            customer: template.customer,
            origin: template.origin,
            destination: template.destination,
            vehicleId: template.vehicleId,
            driverId: template.driverId,
            status: "Geplant",
            isRecurring: true,
            weekdays: template.weekdays,
            notes:
              template.notes || "Automatisch aus Dauerfahrt erzeugt",
          };

          const alreadyExists = simulatedTrips.some(
            (trip) =>
              trip.date === candidate.date &&
              trip.title === candidate.title &&
              trip.driverId === candidate.driverId &&
              trip.vehicleId === candidate.vehicleId
          );

          const hasTripConflict = simulatedTrips.some(
            (trip) =>
              tripsOverlap(trip, candidate) &&
              (trip.driverId === candidate.driverId ||
                trip.vehicleId === candidate.vehicleId)
          );

          const hasAbsenceConflict = data.absences.some((absence) =>
            absenceConflictsWithTrip(absence, candidate)
          );

          if (
            !alreadyExists &&
            !hasTripConflict &&
            !hasAbsenceConflict
          ) {
            generatedTrips.push(candidate);
            simulatedTrips.push(candidate);
          }
        });
      });

    setData((current) => ({
      ...current,
      trips: [...current.trips, ...generatedTrips],
    }));

    showToast(
      `${generatedTrips.length} konfliktfreie Dauerfahrten wurden erzeugt.`
    );
  }

  function resetDemo() {
    if (!window.confirm("Alle Änderungen wirklich zurücksetzen?")) return;

    localStorage.removeItem("cockpit-calculation-profit-tiers-v1");
    setData(INITIAL_DATA);
    showToast("Die Demo wurde zurückgesetzt.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo-area">
          <img
            src="/cockpit-logo.png"
            alt="Arpetal Reisen COCKPIT"
            className="cockpit-brand-logo"
          />
        </div>

        <nav className="main-nav">
          {NAVIGATION.map(([key, label, icon]) => (
            <button
              key={key}
              type="button"
              className={page === key ? "active" : ""}
              onClick={() => setPage(key)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="settings-button"
          onClick={resetDemo}
        >
          <Icon name="settings" />
          <span>Demo zurücksetzen</span>
        </button>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Digitale Leitstelle</p>
            <h1>{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            <div className="date-chip">
              <Icon name="calendar" />
              <span>{formatDate(selectedDate)}</span>
            </div>

            <div className="user-chip">
              <span className="avatar">MD</span>
              <div>
                <strong>Marc</strong>
                <small>Leitstelle</small>
              </div>
            </div>
          </div>
        </header>

        {toast && <div className="toast">{toast}</div>}

        {page === "dashboard" && (
          <>
            <div className="hero-row">
              <div>
                <h2>Guten Morgen, Marc</h2>
                <p>Hier ist der aktuelle Überblick über den Betrieb.</p>
              </div>

              <button
                type="button"
                className="button primary"
                onClick={() => setPage("disposition")}
              >
                <Icon name="plus" />
                Neue Fahrt
              </button>
            </div>

            <div
              className={
                conflictMap.size
                  ? "status-bar warning"
                  : "status-bar ok"
              }
            >
              <span className="status-dot" />
              {conflictMap.size
                ? `${conflictMap.size} Fahrt(en) mit Konflikt`
                : "Alles läuft nach Plan"}
            </div>

            <div className="kpi-grid">
              <Kpi
                label="Fahrten am Tag"
                value={dayTrips.length}
                sub="Gesamt"
                icon="calendar"
              />
              <Kpi
                label="Fahrzeuge"
                value={data.vehicles.length}
                sub="im System"
                icon="bus"
              />
              <Kpi
                label="Fahrer"
                value={data.drivers.length}
                sub="im System"
                icon="user"
              />
              <Kpi
                label="Abwesende Fahrer"
                value={currentAbsences.length}
                sub={formatDate(selectedDate)}
                icon="vacation"
              />
            </div>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Tagesplan</h3>
                  <p>
                    Fahrer und Fahrzeuge sind bereits ab der Anfahrt
                    blockiert.
                  </p>
                </div>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                />
              </div>

              <TripList
                trips={dayTrips}
                conflicts={conflictMap}
                vehicleMap={vehicleMap}
                driverMap={driverMap}
                onEdit={editTrip}
                onDelete={deleteTrip}
              />
            </section>
          </>
        )}

        {page === "disposition" && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>
                    {editingTripId
                      ? "Fahrt bearbeiten"
                      : "Neue Fahrt anlegen"}
                  </h3>
                  <p>
                    Die Konfliktprüfung berücksichtigt Anfahrt,
                    Fahrtbeginn, Fahrtende und Abwesenheiten.
                  </p>
                </div>
              </div>

              <form className="form-grid" onSubmit={saveTrip}>
                <Field label="Datum">
                  <input
                    type="date"
                    value={tripForm.date}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        date: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Auftrag">
                  <input
                    value={tripForm.title}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        title: event.target.value,
                      })
                    }
                    placeholder="z. B. Flughafentransfer"
                  />
                </Field>

                <Field label="Anfahrt ab">
                  <input
                    type="time"
                    value={tripForm.approachStart}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        approachStart: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Fahrtbeginn">
                  <input
                    type="time"
                    value={tripForm.start}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        start: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Fahrtende">
                  <input
                    type="time"
                    value={tripForm.end}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        end: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Fahrtart">
                  <select
                    value={
                      tripForm.isRecurring
                        ? "dauerfahrt"
                        : "einzelfahrt"
                    }
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        isRecurring:
                          event.target.value === "dauerfahrt",
                        weekdays:
                          event.target.value === "dauerfahrt"
                            ? tripForm.weekdays.length
                              ? tripForm.weekdays
                              : [1, 2, 3, 4, 5]
                            : [],
                      })
                    }
                  >
                    <option value="einzelfahrt">Einzelfahrt</option>
                    <option value="dauerfahrt">Dauerfahrt</option>
                  </select>
                </Field>

                {tripForm.isRecurring && (
                  <Field label="Wochentage" wide>
                    <WeekdayPicker
                      selected={tripForm.weekdays}
                      onToggle={toggleTripWeekday}
                    />
                  </Field>
                )}

                <Field label="Kunde">
                  <input
                    value={tripForm.customer}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        customer: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={tripForm.status}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option>Geplant</option>
                    <option>Bestätigt</option>
                    <option>Unterwegs</option>
                    <option>Abgeschlossen</option>
                    <option>Abgesagt</option>
                  </select>
                </Field>

                <Field label="Startort">
                  <input
                    value={tripForm.origin}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        origin: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Zielort">
                  <input
                    value={tripForm.destination}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        destination: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Fahrzeug">
                  <select
                    value={tripForm.vehicleId}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        vehicleId: event.target.value,
                      })
                    }
                  >
                    {data.vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Fahrer">
                  <select
                    value={tripForm.driverId}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        driverId: event.target.value,
                      })
                    }
                  >
                    {data.drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Bemerkung" wide>
                  <textarea
                    value={tripForm.notes}
                    onChange={(event) =>
                      setTripForm({
                        ...tripForm,
                        notes: event.target.value,
                      })
                    }
                  />
                </Field>

                <div className="form-actions wide">
                  <button type="submit" className="button primary">
                    {editingTripId
                      ? "Änderung speichern"
                      : "Fahrt speichern"}
                  </button>

                  {editingTripId && (
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => {
                        setEditingTripId(null);
                        setTripForm({
                          ...EMPTY_TRIP,
                          date: selectedDate,
                        });
                      }}
                    >
                      Abbrechen
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Alle Fahrten</h3>
                  <p>{data.trips.length} Einträge</p>
                </div>
              </div>

              <TripList
                trips={[...data.trips].sort((first, second) =>
                  `${first.date}${tripBlockStart(first)}`.localeCompare(
                    `${second.date}${tripBlockStart(second)}`
                  )
                )}
                conflicts={conflictMap}
                vehicleMap={vehicleMap}
                driverMap={driverMap}
                onEdit={editTrip}
                onDelete={deleteTrip}
              />
            </section>
          </>
        )}

        {page === "vehicles" && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Fahrzeug hinzufügen</h3>
                  <p>Fuhrparkdaten verwalten</p>
                </div>
              </div>

              <form className="form-grid" onSubmit={saveVehicle}>
                <Field label="Name">
                  <input
                    value={vehicleForm.name}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Kennzeichen">
                  <input
                    value={vehicleForm.plate}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        plate: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Sitzplätze">
                  <input
                    type="number"
                    min="1"
                    value={vehicleForm.seats}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        seats: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={vehicleForm.status}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option>Verfügbar</option>
                    <option>Im Einsatz</option>
                    <option>Werkstatt</option>
                    <option>ÖPNV</option>
                  </select>
                </Field>

                <Field label="TÜV">
                  <input
                    type="date"
                    value={vehicleForm.tuv}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        tuv: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Kilometerstand">
                  <input
                    type="number"
                    min="0"
                    value={vehicleForm.mileage}
                    onChange={(event) =>
                      setVehicleForm({
                        ...vehicleForm,
                        mileage: event.target.value,
                      })
                    }
                  />
                </Field>

                <div className="form-actions wide">
                  <button type="submit" className="button primary">
                    Fahrzeug speichern
                  </button>
                </div>
              </form>
            </section>

            <div className="card-grid">
              {data.vehicles.map((vehicle) => (
                <EntityCard
                  key={vehicle.id}
                  icon="bus"
                  title={vehicle.name}
                  subtitle={vehicle.plate}
                  rows={[
                    ["Sitzplätze", vehicle.seats],
                    ["Status", vehicle.status],
                    ["TÜV", formatDate(vehicle.tuv)],
                    [
                      "Kilometerstand",
                      `${Number(vehicle.mileage).toLocaleString(
                        "de-DE"
                      )} km`,
                    ],
                  ]}
                  onDelete={() =>
                    setData((current) => ({
                      ...current,
                      vehicles: current.vehicles.filter(
                        (item) => item.id !== vehicle.id
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </>
        )}


        {page === "calculation" && (
          <>
            <section className="panel calculation-header">
              <div className="panel-head">
                <div>
                  <h3>Fahrzeugkalkulation</h3>
                  <p>
                    Kosten und Angebotspreise für jedes Fahrzeug
                    individuell berechnen.
                  </p>
                </div>

                <div className="calculation-toolbar">
                  <select
                    value={selectedCalculationVehicle}
                    onChange={(event) =>
                      setSelectedCalculationVehicle(event.target.value)
                    }
                  >
                    {data.vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} · {vehicle.plate}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="button secondary"
                    onClick={resetCalculation}
                  >
                    Werte zurücksetzen
                  </button>
                </div>
              </div>
            </section>

            <div className="calculation-layout">
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Jährliche Fahrzeugkosten</h3>
                    <p>Alle Werte können frei angepasst werden.</p>
                  </div>
                </div>

                <div className="cost-section">
                  <h4>Fixkosten pro Jahr</h4>
                  <div className="calculation-input-grid">
                    <CalculationInput
                      label="Abschreibung"
                      value={selectedCalculationProfile.depreciation}
                      onChange={(value) =>
                        updateCalculation("depreciation", value)
                      }
                    />
                    <CalculationInput
                      label="Versicherung"
                      value={selectedCalculationProfile.insurance}
                      onChange={(value) =>
                        updateCalculation("insurance", value)
                      }
                    />
                    <CalculationInput
                      label="Kfz-Steuer"
                      value={selectedCalculationProfile.vehicleTax}
                      onChange={(value) =>
                        updateCalculation("vehicleTax", value)
                      }
                    />
                    <CalculationInput
                      label="Standkosten / Reserve"
                      value={selectedCalculationProfile.standbyCosts}
                      onChange={(value) =>
                        updateCalculation("standbyCosts", value)
                      }
                    />
                    <CalculationInput
                      label="Verwaltung / Disposition"
                      value={selectedCalculationProfile.administration}
                      onChange={(value) =>
                        updateCalculation("administration", value)
                      }
                    />
                  </div>
                </div>

                <div className="cost-section">
                  <h4>Variable Kosten pro Jahr</h4>
                  <div className="calculation-input-grid">
                    <CalculationInput
                      label="Diesel / Strom"
                      value={selectedCalculationProfile.fuelEnergy}
                      onChange={(value) =>
                        updateCalculation("fuelEnergy", value)
                      }
                    />
                    <CalculationInput
                      label="Wartung und Reparatur"
                      value={selectedCalculationProfile.maintenance}
                      onChange={(value) =>
                        updateCalculation("maintenance", value)
                      }
                    />
                    <CalculationInput
                      label="Reifen"
                      value={selectedCalculationProfile.tires}
                      onChange={(value) =>
                        updateCalculation("tires", value)
                      }
                    />
                    <CalculationInput
                      label="Reinigung"
                      value={selectedCalculationProfile.cleaning}
                      onChange={(value) =>
                        updateCalculation("cleaning", value)
                      }
                    />
                  </div>
                </div>

                <div className="cost-section">
                  <h4>Leistungs- und Preiswerte</h4>
                  <div className="calculation-input-grid">
                    <CalculationInput
                      label="Jahreskilometer"
                      value={selectedCalculationProfile.annualKilometers}
                      suffix="km"
                      step="100"
                      onChange={(value) =>
                        updateCalculation("annualKilometers", value)
                      }
                    />
                    <CalculationInput
                      label="Personalkosten pro Stunde"
                      value={selectedCalculationProfile.personnelPerHour}
                      suffix="€"
                      step="0.5"
                      onChange={(value) =>
                        updateCalculation("personnelPerHour", value)
                      }
                    />
                    <CalculationInput
                      label="Mehrwertsteuer"
                      value={selectedCalculationProfile.vatPercent}
                      suffix="%"
                      step="1"
                      onChange={(value) =>
                        updateCalculation("vatPercent", value)
                      }
                    />
                  </div>
                </div>

                <div className="cost-section">
                  <div className="profit-tier-heading">
                    <div>
                      <h4>Automatische Gewinnstaffel</h4>
                      <p>
                        Der Gewinnaufschlag wird anhand der
                        Auftragskilometer automatisch ausgewählt.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="button secondary"
                      onClick={addProfitTier}
                    >
                      + Stufe hinzufügen
                    </button>
                  </div>

                  <div className="profit-tier-table-wrap">
                    <table className="profit-tier-table">
                      <thead>
                        <tr>
                          <th>Von km</th>
                          <th>Bis km</th>
                          <th>Gewinn</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {normalizeProfitTiers(
                          selectedCalculationProfile
                        ).map((tier) => (
                          <tr
                            className={
                              calculationResults.appliedProfitTier
                                ?.id === tier.id
                                ? "active-tier"
                                : ""
                            }
                            key={tier.id}
                          >
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={tier.fromKm}
                                onChange={(event) =>
                                  updateProfitTier(
                                    tier.id,
                                    "fromKm",
                                    event.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={tier.toKm}
                                placeholder="unbegrenzt"
                                onChange={(event) =>
                                  updateProfitTier(
                                    tier.id,
                                    "toKm",
                                    event.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <div className="tier-percent-field">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={tier.percent}
                                  onChange={(event) =>
                                    updateProfitTier(
                                      tier.id,
                                      "percent",
                                      event.target.value
                                    )
                                  }
                                />
                                <span>%</span>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="tier-delete"
                                onClick={() =>
                                  deleteProfitTier(tier.id)
                                }
                                aria-label="Gewinnstufe löschen"
                              >
                                Löschen
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="active-profit-note">
                    <span>Aktuell verwendeter Gewinnaufschlag</span>
                    <strong>
                      {calculationResults.appliedProfitPercent.toLocaleString(
                        "de-DE"
                      )}{" "}
                      %
                    </strong>
                  </div>
                </div>

              </section>

              <aside className="panel calculation-summary">
                <h3>Kostenübersicht</h3>

                <CalculationResult
                  label="Summe Fixkosten"
                  value={formatCurrency(calculationResults.fixedCosts)}
                />
                <CalculationResult
                  label="Summe variable Kosten"
                  value={formatCurrency(calculationResults.variableCosts)}
                />
                <CalculationResult
                  label="Gesamtkosten pro Jahr"
                  value={formatCurrency(calculationResults.annualCosts)}
                  strong
                />

                <div className="summary-divider" />

                <CalculationResult
                  label="Fixkosten pro km"
                  value={formatCurrency(
                    calculationResults.fixedPerKilometer
                  )}
                />
                <CalculationResult
                  label="Variable Kosten pro km"
                  value={formatCurrency(
                    calculationResults.variablePerKilometer
                  )}
                />
                <CalculationResult
                  label="Betriebskosten pro km"
                  value={formatCurrency(
                    calculationResults.operatingCostPerKilometer
                  )}
                  strong
                />
              </aside>
            </div>

            <section className="panel order-calculation">
              <div className="panel-head">
                <div>
                  <h3>Auftragskalkulation</h3>
                  <p>
                    Kilometer und Einsatzzeit eingeben – der Preis wird
                    sofort berechnet.
                  </p>
                </div>
              </div>

              <div className="order-inputs">
                <CalculationInput
                  label="Auftragskilometer"
                  value={selectedCalculationProfile.orderKilometers}
                  suffix="km"
                  step="1"
                  highlight
                  onChange={(value) =>
                    updateCalculation("orderKilometers", value)
                  }
                />
                <CalculationInput
                  label="Auftragszeit"
                  value={selectedCalculationProfile.orderHours}
                  suffix="Std."
                  step="0.25"
                  highlight
                  onChange={(value) =>
                    updateCalculation("orderHours", value)
                  }
                />
              </div>

              <div className="order-results">
                <CalculationResult
                  label="Gewinnaufschlag laut Kilometerstaffel"
                  value={`${calculationResults.appliedProfitPercent.toLocaleString(
                    "de-DE"
                  )} %`}
                  strong
                />
                <CalculationResult
                  label="Kosten Strecke"
                  value={formatCurrency(calculationResults.routeCosts)}
                />
                <CalculationResult
                  label="Kosten Zeit / Personal"
                  value={formatCurrency(
                    calculationResults.personnelCosts
                  )}
                />
                <CalculationResult
                  label="Auftragskosten gesamt"
                  value={formatCurrency(calculationResults.orderCosts)}
                  strong
                />
                <CalculationResult
                  label="Kosten je Auftragskilometer"
                  value={formatCurrency(
                    calculationResults.costPerOrderKilometer
                  )}
                />
              </div>

              <div className="price-cards">
                <article className="price-card net">
                  <span>
                    Nettopreis inkl.{" "}
                    {calculationResults.appliedProfitPercent.toLocaleString(
                      "de-DE"
                    )}{" "}
                    % Gewinn laut Staffel
                  </span>
                  <strong>
                    {formatCurrency(calculationResults.netPrice)}
                  </strong>
                </article>

                <article className="price-card gross">
                  <span>
                    Bruttopreis inkl.{" "}
                    {numberValue(
                      selectedCalculationProfile.vatPercent
                    ).toLocaleString("de-DE")}{" "}
                    % MwSt.
                  </span>
                  <strong>
                    {formatCurrency(calculationResults.grossPrice)}
                  </strong>
                </article>
              </div>
            </section>
          </>
        )}

        {page === "drivers" && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Fahrer hinzufügen</h3>
                  <p>Personal und Dokumente verwalten</p>
                </div>
              </div>

              <form className="form-grid" onSubmit={saveDriver}>
                <Field label="Name">
                  <input
                    value={driverForm.name}
                    onChange={(event) =>
                      setDriverForm({
                        ...driverForm,
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Beschäftigung">
                  <select
                    value={driverForm.employment}
                    onChange={(event) =>
                      setDriverForm({
                        ...driverForm,
                        employment: event.target.value,
                      })
                    }
                  >
                    <option>Minijob</option>
                    <option>Festangestellt</option>
                    <option>Reserve</option>
                  </select>
                </Field>

                <Field label="Telefon">
                  <input
                    value={driverForm.phone}
                    onChange={(event) =>
                      setDriverForm({
                        ...driverForm,
                        phone: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={driverForm.status}
                    onChange={(event) =>
                      setDriverForm({
                        ...driverForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option>Verfügbar</option>
                    <option>Im Einsatz</option>
                    <option>Urlaub</option>
                    <option>Krank</option>
                  </select>
                </Field>

                <Field label="P-Schein gültig bis">
                  <input
                    type="date"
                    value={driverForm.permitUntil}
                    onChange={(event) =>
                      setDriverForm({
                        ...driverForm,
                        permitUntil: event.target.value,
                      })
                    }
                  />
                </Field>

                <div className="form-actions wide">
                  <button type="submit" className="button primary">
                    Fahrer speichern
                  </button>
                </div>
              </form>
            </section>

            <div className="card-grid">
              {data.drivers.map((driver) => (
                <EntityCard
                  key={driver.id}
                  icon="user"
                  title={driver.name}
                  subtitle={driver.employment}
                  rows={[
                    ["Telefon", driver.phone],
                    ["Status", driver.status],
                    [
                      "P-Schein gültig bis",
                      formatDate(driver.permitUntil),
                    ],
                  ]}
                  onDelete={() =>
                    setData((current) => ({
                      ...current,
                      drivers: current.drivers.filter(
                        (item) => item.id !== driver.id
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </>
        )}

        {page === "recurring" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Dauerfahrten</h3>
                <p>
                  Vorlagen mit Anfahrt, Fahrer, Fahrzeug und
                  Wochentagen
                </p>
              </div>

              <button
                type="button"
                className="button primary"
                onClick={generateNextWeek}
              >
                Nächste Woche erzeugen
              </button>
            </div>

            <div className="simple-list">
              {data.recurringTrips.map((template) => (
                <div className="simple-row" key={template.id}>
                  <div>
                    <strong>{template.title}</strong>
                    <span>
                      Anfahrt {template.approachStart || "–"} · Fahrt{" "}
                      {template.start} – {template.end}
                    </span>
                    <span>
                      Wochentage: {formatWeekdays(template.weekdays)}
                    </span>
                  </div>

                  <span>
                    {vehicleMap[template.vehicleId]?.name || "–"}
                  </span>

                  <span>
                    {driverMap[template.driverId]?.name || "–"}
                  </span>

                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={template.active}
                      onChange={() =>
                        setData((current) => ({
                          ...current,
                          recurringTrips: current.recurringTrips.map(
                            (item) =>
                              item.id === template.id
                                ? {
                                    ...item,
                                    active: !item.active,
                                  }
                                : item
                          ),
                        }))
                      }
                    />
                    Aktiv
                  </label>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "vacation" && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Abwesenheit eintragen</h3>
                  <p>
                    Urlaub, Krankheit, freie Tage und wiederkehrende
                    Sperrzeiten verwalten
                  </p>
                </div>
              </div>

              <form
                className="form-grid vacation-form"
                onSubmit={saveAbsence}
              >
                <Field label="Fahrer">
                  <select
                    value={absenceForm.driverId}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        driverId: event.target.value,
                      })
                    }
                  >
                    {data.drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Art der Abwesenheit">
                  <select
                    value={absenceForm.type}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        type: event.target.value,
                      })
                    }
                  >
                    <option>Urlaub</option>
                    <option>Krank</option>
                    <option>Frei</option>
                    <option>Schulung</option>
                  </select>
                </Field>

                <Field label="Wiederholung">
                  <select
                    value={absenceForm.recurrence}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        recurrence: event.target.value,
                        weekdays:
                          event.target.value === "weekly"
                            ? absenceForm.weekdays.length
                              ? absenceForm.weekdays
                              : [2]
                            : [],
                      })
                    }
                  >
                    <option value="once">Einmalig</option>
                    <option value="weekly">
                      Wöchentlich wiederkehrend
                    </option>
                  </select>
                </Field>

                <Field
                  label={
                    absenceForm.recurrence === "weekly"
                      ? "Gültig ab"
                      : "Beginn"
                  }
                >
                  <input
                    type="date"
                    value={absenceForm.startDate}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        startDate: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field
                  label={
                    absenceForm.recurrence === "weekly"
                      ? "Gültig bis"
                      : "Ende"
                  }
                >
                  <input
                    type="date"
                    value={absenceForm.endDate}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        endDate: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Genehmigungsstatus">
                  <select
                    value={absenceForm.approval}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        approval: event.target.value,
                      })
                    }
                  >
                    <option>Beantragt</option>
                    <option>Genehmigt</option>
                    <option>Abgelehnt</option>
                  </select>
                </Field>

                {absenceForm.recurrence === "weekly" && (
                  <Field label="Wiederkehrende Wochentage" wide>
                    <WeekdayPicker
                      selected={absenceForm.weekdays}
                      onToggle={toggleAbsenceWeekday}
                    />
                  </Field>
                )}

                <Field label="Ganztags">
                  <label className="switch-field">
                    <input
                      type="checkbox"
                      checked={absenceForm.allDay}
                      onChange={(event) =>
                        setAbsenceForm({
                          ...absenceForm,
                          allDay: event.target.checked,
                        })
                      }
                    />
                    <span>
                      {absenceForm.allDay ? "Ja" : "Nein"}
                    </span>
                  </label>
                </Field>

                {!absenceForm.allDay && (
                  <>
                    <Field label="Von Uhrzeit">
                      <input
                        type="time"
                        value={absenceForm.fromTime}
                        onChange={(event) =>
                          setAbsenceForm({
                            ...absenceForm,
                            fromTime: event.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label="Bis Uhrzeit">
                      <input
                        type="time"
                        value={absenceForm.toTime}
                        onChange={(event) =>
                          setAbsenceForm({
                            ...absenceForm,
                            toTime: event.target.value,
                          })
                        }
                      />
                    </Field>
                  </>
                )}

                <Field label="Bemerkung" wide>
                  <textarea
                    value={absenceForm.notes}
                    onChange={(event) =>
                      setAbsenceForm({
                        ...absenceForm,
                        notes: event.target.value,
                      })
                    }
                  />
                </Field>

                <div className="form-actions wide">
                  <button type="submit" className="button primary">
                    Abwesenheit speichern
                  </button>
                </div>
              </form>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Urlaubskalender</h3>
                  <p>
                    Monatsübersicht aller beantragten und genehmigten
                    Abwesenheiten
                  </p>
                </div>

                <input
                  type="month"
                  value={vacationMonth}
                  onChange={(event) =>
                    setVacationMonth(event.target.value)
                  }
                />
              </div>

              <div className="vacation-calendar">
                <div className="calendar-weekdays">
                  {WEEKDAYS.slice(0, 7).map((day) => (
                    <strong key={day.id}>{day.short}</strong>
                  ))}
                </div>

                <div className="calendar-grid">
                  {Array.from({ length: monthOffset }).map(
                    (_, index) => (
                      <div
                        className="calendar-day empty-day"
                        key={`empty-${index}`}
                      />
                    )
                  )}

                  {calendarDays.map((date) => {
                    const absencesForDay = data.absences.filter(
                      (absence) =>
                        absence.approval !== "Abgelehnt" &&
                        absenceOccursOnDate(absence, date)
                    );

                    return (
                      <div
                        className={
                          date === selectedDate
                            ? "calendar-day selected-day"
                            : "calendar-day"
                        }
                        key={date}
                      >
                        <button
                          type="button"
                          className="calendar-date"
                          onClick={() => setSelectedDate(date)}
                        >
                          {Number(date.slice(-2))}
                        </button>

                        <div className="calendar-entries">
                          {absencesForDay
                            .slice(0, 4)
                            .map((absence) => (
                              <div
                                className={`absence-chip ${absence.type.toLowerCase()}`}
                                key={absence.id}
                              >
                                <span>
                                  {driverMap[absence.driverId]?.name ||
                                    "–"}
                                </span>
                                <small>
                                  {absence.type} ·{" "}
                                  {absenceTimeText(absence)}
                                </small>
                              </div>
                            ))}

                          {absencesForDay.length > 4 && (
                            <small className="more-entries">
                              +{absencesForDay.length - 4}
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Alle Abwesenheiten</h3>
                  <p>{data.absences.length} Einträge</p>
                </div>
              </div>

              <div className="absence-list">
                {data.absences.length === 0 && (
                  <div className="empty">
                    Keine Abwesenheiten vorhanden.
                  </div>
                )}

                {[...data.absences]
                  .sort((first, second) =>
                    first.startDate.localeCompare(second.startDate)
                  )
                  .map((absence) => {
                    const affectedTrips = data.trips.filter((trip) =>
                      absenceConflictsWithTrip(
                        {
                          ...absence,
                          approval: "Genehmigt",
                        },
                        trip
                      )
                    ).length;

                    return (
                      <article
                        className="absence-row"
                        key={absence.id}
                      >
                        <div>
                          <strong>
                            {driverMap[absence.driverId]?.name || "–"}
                          </strong>

                          <span>
                            {formatDate(absence.startDate)} –{" "}
                            {formatDate(absence.endDate)}
                          </span>

                          <span>
                            {absence.recurrence === "weekly"
                              ? `Wöchentlich: ${formatWeekdays(
                                  absence.weekdays
                                )}`
                              : "Einmalig"}
                            {" · "}
                            {absenceTimeText(absence)}
                          </span>
                        </div>

                        <StatusBadge value={absence.type} />
                        <StatusBadge value={absence.approval} />

                        <span
                          className={
                            affectedTrips
                              ? "affected-trips warning-text"
                              : "affected-trips"
                          }
                        >
                          {affectedTrips
                            ? `${affectedTrips} Fahrt(en) betroffen`
                            : "Keine Fahrt betroffen"}
                        </span>

                        <button
                          type="button"
                          className="absence-delete"
                          onClick={() =>
                            deleteAbsence(absence.id)
                          }
                        >
                          Löschen
                        </button>
                      </article>
                    );
                  })}
              </div>
            </section>
          </>
        )}

        {page === "requests" && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Anfrage hinzufügen</h3>
                  <p>Website, Telefon, E-Mail oder WhatsApp</p>
                </div>
              </div>

              <form className="form-grid" onSubmit={saveRequest}>
                <Field label="Kunde">
                  <input
                    value={requestForm.customer}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        customer: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Auftrag">
                  <input
                    value={requestForm.title}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        title: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Datum">
                  <input
                    type="date"
                    value={requestForm.date}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        date: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Personen">
                  <input
                    type="number"
                    min="1"
                    value={requestForm.people}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        people: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Quelle">
                  <select
                    value={requestForm.source}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        source: event.target.value,
                      })
                    }
                  >
                    <option>Telefon</option>
                    <option>Website</option>
                    <option>E-Mail</option>
                    <option>WhatsApp</option>
                  </select>
                </Field>

                <div className="form-actions wide">
                  <button type="submit" className="button primary">
                    Anfrage speichern
                  </button>
                </div>
              </form>
            </section>

            <div className="card-grid">
              {data.requests.map((request) => (
                <article className="entity-card" key={request.id}>
                  <div className="entity-icon">
                    <Icon name="inbox" />
                  </div>

                  <h3>{request.customer}</h3>
                  <p>{request.title}</p>

                  <dl>
                    <div>
                      <dt>Datum</dt>
                      <dd>{formatDate(request.date)}</dd>
                    </div>
                    <div>
                      <dt>Personen</dt>
                      <dd>{request.people}</dd>
                    </div>
                    <div>
                      <dt>Quelle</dt>
                      <dd>{request.source}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <StatusBadge value={request.status} />
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className="button primary full"
                    onClick={() => requestToTrip(request)}
                  >
                    In Fahrt übernehmen
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {page === "driverApp" && (
          <section className="panel narrow">
            <div className="panel-head">
              <div>
                <h3>Fahrer-App</h3>
                <p>Persönlicher Tagesplan des Fahrers</p>
              </div>

              <select
                value={selectedDriver}
                onChange={(event) =>
                  setSelectedDriver(event.target.value)
                }
              >
                {data.drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="driver-list">
              {driverTrips.map((trip) => (
                <article className="driver-trip" key={trip.id}>
                  <div className="driver-time">
                    {formatDate(trip.date)} · Anfahrt{" "}
                    {trip.approachStart || trip.start}
                  </div>

                  <h3>{trip.title}</h3>
                  <p>
                    Fahrt: {trip.start} – {trip.end}
                  </p>
                  <p>
                    {trip.origin || "Start"} →{" "}
                    {trip.destination || "Ziel"}
                  </p>
                  <p>
                    Fahrzeug:{" "}
                    {vehicleMap[trip.vehicleId]?.name || "–"}
                  </p>

                  {trip.isRecurring && (
                    <span className="recurring-label">
                      Dauerfahrt · {formatWeekdays(trip.weekdays)}
                    </span>
                  )}

                  <StatusBadge value={trip.status} />
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "reports" && (
          <>
            <div className="kpi-grid">
              <Kpi
                label="Fahrten gesamt"
                value={data.trips.length}
                sub="alle Termine"
                icon="calendar"
              />
              <Kpi
                label="Dauerfahrten"
                value={
                  data.recurringTrips.filter(
                    (template) => template.active
                  ).length
                }
                sub="aktive Vorlagen"
                icon="repeat"
              />
              <Kpi
                label="Genehmigte Abwesenheiten"
                value={
                  data.absences.filter(
                    (absence) =>
                      absence.approval === "Genehmigt"
                  ).length
                }
                sub="gesamt"
                icon="vacation"
              />
              <Kpi
                label="Konflikte"
                value={conflictMap.size}
                sub="inklusive Anfahrt"
                icon="alert"
              />
            </div>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>Fahrzeugauslastung</h3>
                  <p>Anzahl zugewiesener Fahrten</p>
                </div>
              </div>

              {data.vehicles.map((vehicle) => {
                const count = data.trips.filter(
                  (trip) => trip.vehicleId === vehicle.id
                ).length;

                return (
                  <div className="bar-row" key={vehicle.id}>
                    <span>{vehicle.name}</span>
                    <div className="bar">
                      <i
                        style={{
                          width: `${Math.min(100, count * 20)}%`,
                        }}
                      />
                    </div>
                    <strong>{count}</strong>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={wide ? "field wide" : "field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function WeekdayPicker({ selected, onToggle }) {
  return (
    <div className="weekday-picker">
      {WEEKDAYS.map((day) => (
        <label
          className={
            selected.includes(day.id)
              ? "weekday active"
              : "weekday"
          }
          key={day.id}
          title={day.long}
        >
          <input
            type="checkbox"
            checked={selected.includes(day.id)}
            onChange={() => onToggle(day.id)}
          />
          <span>{day.short}</span>
        </label>
      ))}
    </div>
  );
}

function Kpi({ label, value, sub, icon }) {
  return (
    <article className="kpi-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{sub}</small>
      </div>

      <div className="kpi-icon">
        <Icon name={icon} />
      </div>
    </article>
  );
}

function TripList({
  trips,
  conflicts,
  vehicleMap,
  driverMap,
  onEdit,
  onDelete,
}) {
  if (!trips.length) {
    return <div className="empty">Keine Fahrten vorhanden.</div>;
  }

  return (
    <div className="trip-scroll">
      <div className="trip-list">
        {trips.map((trip) => {
          const conflict = conflicts.get(trip.id);

          return (
            <div
              className={
                conflict ? "trip-row conflict" : "trip-row"
              }
              key={trip.id}
            >
              <div className="trip-time">
                <strong>
                  Anfahrt {trip.approachStart || trip.start}
                </strong>
                <span>
                  Fahrt {trip.start} – {trip.end}
                </span>
                <span>{formatDate(trip.date)}</span>
              </div>

              <div className="trip-main">
                <strong>{trip.title}</strong>
                <span>
                  {trip.customer || trip.origin || "Ohne Kunde"}
                </span>

                {trip.isRecurring && (
                  <span className="recurring-label">
                    Dauerfahrt · {formatWeekdays(trip.weekdays)}
                  </span>
                )}

                {conflict && (
                  <span className="conflict-reason">
                    Konflikt: {conflict}
                  </span>
                )}
              </div>

              <span className="pill">
                {vehicleMap[trip.vehicleId]?.name ||
                  "Kein Fahrzeug"}
              </span>

              <span>
                {driverMap[trip.driverId]?.name || "Kein Fahrer"}
              </span>

              <StatusBadge
                value={conflict ? "Konflikt" : trip.status}
              />

              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => onEdit(trip)}
                >
                  Bearbeiten
                </button>

                <button
                  type="button"
                  className="danger-text"
                  onClick={() => onDelete(trip.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EntityCard({
  icon,
  title,
  subtitle,
  rows,
  onDelete,
}) {
  return (
    <article className="entity-card">
      <div className="entity-icon">
        <Icon name={icon} />
      </div>

      <h3>{title}</h3>
      <p className="muted">{subtitle}</p>

      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        className="button danger"
        onClick={onDelete}
      >
        Löschen
      </button>
    </article>
  );
}


function CalculationInput({
  label,
  value,
  onChange,
  suffix = "€",
  step = "1",
  highlight = false,
}) {
  return (
    <label
      className={
        highlight
          ? "calculation-input highlighted"
          : "calculation-input"
      }
    >
      <span>{label}</span>
      <div className="number-field">
        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <small>{suffix}</small>
      </div>
    </label>
  );
}

function CalculationResult({ label, value, strong = false }) {
  return (
    <div
      className={
        strong
          ? "calculation-result strong"
          : "calculation-result"
      }
    >
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function StatusBadge({ value }) {
  const key = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span className={`status-badge ${key}`}>{value}</span>
  );
}

function Icon({ name }) {
  const icons = {
    home: (
      <>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13v-9.5" />
        <path d="M9.5 20v-6h5v6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    bus: (
      <>
        <rect x="5" y="3" width="14" height="17" rx="3" />
        <path d="M5 9h14M8 20v2M16 20v2" />
        <path d="M8 16h.01M16 16h.01" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.2-6 8-6s6.5 2 8 6" />
      </>
    ),
    repeat: (
      <>
        <path d="m17 1 4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="m7 23-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </>
    ),
    vacation: (
      <>
        <path d="M4 19h16" />
        <path d="M7 16c1.5-4 3.5-7 5-10 1.5 3 3.5 6 5 10" />
        <path d="M9 11h6M6 4h12" />
      </>
    ),
    inbox: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M4 14h4l2 3h4l2-3h4" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    calculator: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.home}
    </svg>
  );
}
