// src/pages/Circulation.jsx

import { useQuery } from "@tanstack/react-query";
import { circulationService } from "../services/circulationService";
import Layout from "../components/Layout";

function Circulation() {
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: circulationService.getAll,
    refetchInterval: 5000,
  });

  return (
    <Layout>
      <h1 className="page-title">Transaction</h1>

      <div className="card">
        <div className="card-title">
          <span className="card-icon">🔄</span>
          Transaction
        </div>

        {isLoading ? (
          <div className="state-box"><div className="state-icon">⏳</div><p>Loading transactions…</p></div>
        ) : error ? (
          <div className="state-box">
            <div className="state-icon">⚠️</div>
            <p>Failed to load transactions. Make sure Django is running.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="state-box">
            <div className="state-icon">🔄</div>
            <p>No transactions yet. Issue a book to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>T_ID</th>
                  <th>User ID</th>
                  <th>S_ID</th>
                  <th>Book ID</th>
                  <th>Transaction Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.transaction_id}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                      {tx.transaction_id.slice(0, 6)}
                    </td>
                    <td>{tx.member_name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>
                      {tx.member.slice(0, 6)}
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>
                      {tx.book_title}
                    </td>
                    <td>
                      <span className={`badge badge-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {new Date(tx.borrow_date).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                      })}{" "}
                      {tx.return_date
                        ? `→ ${new Date(tx.return_date).toLocaleDateString("en-GB")}`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Circulation;