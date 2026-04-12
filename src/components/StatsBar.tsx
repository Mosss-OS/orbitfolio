import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "$67K+", label: "DEMO PORTFOLIO" },
  { value: "6", label: "PROTOCOLS" },
  { value: "30+", label: "TRANSACTIONS" },
  { value: "∞", label: "COSMIC ENTROPY" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative z-10 border-y border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center justify-center py-8 md:py-10 border-r border-border last:border-r-0 even:border-r-0 md:even:border-r"
          >
            <span className="stat-value text-foreground">{stat.value}</span>
            <span className="label-caps mt-2">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
