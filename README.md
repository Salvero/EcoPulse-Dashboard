# EcoPulse Dashboard 🌿

**EcoPulse** is a modern, real-time dashboard designed to visualize the correlation between renewable energy production (Solar) and carbon intensity. It demonstrates how clean energy sources directly impact and reduce the carbon footprint of energy consumption.

![EcoPulse Dashboard](https://via.placeholder.com/1200x600?text=EcoPulse+Dashboard+Preview)
*(Note: Replace with actual screenshot)*

## 🚀 Features

-   **Real-Time Monitoring**: Track key environmental metrics including Temperature, Humidity, Wind Speed, and Carbon Intensity.
-   **Energy Correlation Analysis**: A sophisticated dual-axis chart visualizing the inverse relationship between **Solar Output** (Yellow) and **Carbon Intensity** (Red).
    -   *Insight*: Observe how Carbon Intensity drops as Solar Output peaks during the day.
-   **Responsive Design**: Built with a mobile-first approach using TailwindCSS.
-   **Strict Typing**: Fully typed data layer using TypeScript for reliability.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)
-   **Visualization**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State/Data**: React Hooks (simulated async data flow)

## 🏃‍♂️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Salvero/ecopulse-dashboard.git
    cd ecopulse-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/dashboard/`: Reusable dashboard components (StatCards, EnergyChart).
-   `hooks/`: Custom React hooks for data fetching (`useDashboardData`).
-   `lib/`: Utilities and mock data generators (`normalize.ts`, `mockData.ts`).
-   `types/`: TypeScript definitions (`dashboard.ts`).

## 🔮 Future Roadmap

-   [ ] Integration with real-world APIs (Open-Meteo, Carbon Intensity API).
-   [ ] Historical data analysis with date range pickers.
-   [ ] Dark mode support.
-   [ ] Multi-location support.

---

Built with 💚 for a greener future.
